#!/usr/bin/env node
const axios = require("axios");
const cheerio = require("cheerio");

// --- Configuration ---
const CRAWLBASE_API_TOKEN = "JVQkq9LLyulShydkElsbSQ"; // User provided token
const GSMARENA_BASE_URL = "https://www.gsmarena.com/";
// Use Crawlbase Smart Proxy configuration
const CRAWLBASE_PROXY_PORT = 8010; // As per documentation example for HTTP/HTTPS
const CRAWLBASE_PROXY_HOST = "smartproxy.crawlbase.com";

// --- Helper Functions ---
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches a GSMArena URL via the Crawlbase Smart Proxy (Proxy Mode).
 * Handles retries for specific errors like timeouts or potential proxy errors.
 */
async function fetchViaCrawlbase(targetUrl, retries = 3, delayMs = 1000) {
    const fullTargetUrl = targetUrl.startsWith("http") ? targetUrl : `${GSMARENA_BASE_URL}${targetUrl}`;
    // Construct proxy URL using the API token as username
    const proxyUrl = `http://${CRAWLBASE_API_TOKEN}:@${CRAWLBASE_PROXY_HOST}:${CRAWLBASE_PROXY_PORT}`;

    console.log(`[Crawlbase Proxy] Fetching: ${fullTargetUrl} via ${CRAWLBASE_PROXY_HOST} (Attempt ${4 - retries})`);

    try {
        const response = await axios.get(fullTargetUrl, {
            proxy: {
                // Axios proxy config using protocol-specific URLs
                http: proxyUrl,
                https: proxyUrl // Use the same proxy for https targets
            },
            timeout: 90000, // 90 seconds timeout
            // Set a realistic User-Agent
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            }
        });

        console.log(`[Crawlbase Proxy] Fetched ${fullTargetUrl}. Status: ${response.status}`);

        // In proxy mode, the status code is the direct response status from the target site *through* the proxy.
        // A 200 means the proxy successfully fetched the page.
        if (response.status === 200 && response.data) {
            // We successfully got the content from the target URL via the proxy.
            return response.data; // Return HTML content
        } else {
            // Handle non-200 status codes received from the target server via the proxy
            console.warn(`[Crawlbase Proxy] Target server responded with status ${response.status} for ${fullTargetUrl}`);
            throw new Error(`Target server request failed via proxy with status ${response.status}`);
        }
    } catch (error) {
        console.error(`[Crawlbase Proxy] Error fetching ${fullTargetUrl}:`, error.message);

        // Check for specific errors that might warrant a retry
        let shouldRetry = false;
        if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) { // Timeout
             console.warn(`[Crawlbase Proxy] Timeout fetching ${fullTargetUrl}. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
             shouldRetry = true;
        } else if (error.response) {
            // Check for proxy-related errors or target server errors passed through
            console.error(`[Crawlbase Proxy] Received error status: ${error.response.status}`);
            if (error.response.status === 407) {
                 console.error("[Crawlbase Proxy] Proxy Authentication Failed (407). Check your API Token.");
                 // Don't retry on auth failure
            } else if (error.response.status === 429) { // Rate limit from target? Or Crawlbase?
                 console.warn(`[Crawlbase Proxy] Received 429 (Too Many Requests). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
                 shouldRetry = true;
            } else if (error.response.status >= 500) { // Server errors (proxy or target)
                 console.warn(`[Crawlbase Proxy] Received server error ${error.response.status}. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
                 shouldRetry = true;
            }
        } else {
            // Network errors, etc.
             console.warn(`[Crawlbase Proxy] Network or other error. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
             shouldRetry = true; // Retry on generic errors too
        }

        if (shouldRetry && retries > 0) {
            await delay(delayMs);
            return fetchViaCrawlbase(targetUrl, retries - 1, delayMs * 2); // Exponential backoff
        }

        // Re-throw error if retries exhausted or it's a non-retryable error
        // Add more context to the thrown error
        const errorMessage = error.response ? `Status ${error.response.status}` : error.message;
        throw new Error(`Failed to fetch ${fullTargetUrl} via Crawlbase proxy after multiple retries: ${errorMessage}`);
    }
}

/**
 * Scrapes GSMArena using Crawlbase for both search and detail pages.
 */
async function scrapeGsmarena(query) {
    console.log(`[Scraper] Starting custom scrape for query: ${query}`);
    try {
        // 1. Search for the device via Crawlbase Proxy
        const searchUrl = `results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;
        const searchHtml = await fetchViaCrawlbase(searchUrl); // Uses the updated function
        const $search = cheerio.load(searchHtml);

        // 2. Find the first device link from search results
        const deviceLink = $search(".makers ul li a").first();
        if (!deviceLink || deviceLink.length === 0) {
            console.log(`[Scraper] No devices found in search results for query: ${query}`);
            return { error: `No devices found for query: ${query}` };
        }

        const devicePageUrl = deviceLink.attr("href");
        const deviceNameFromSearch = deviceLink.find("strong").text().trim(); // Get name from search result
        console.log(`[Scraper] Found first device link: ${devicePageUrl} (${deviceNameFromSearch})`);

        if (!devicePageUrl) {
             console.error("[Scraper] Could not extract device page URL from search results.");
             return { error: "Failed to parse search results."};
        }

        // 3. Fetch the device detail page via Crawlbase Proxy
        const detailHtml = await fetchViaCrawlbase(devicePageUrl); // Uses the updated function
        const $detail = cheerio.load(detailHtml);

        // 4. Extract details
        const deviceName = $detail("h1.specs-phone-name-title").text().trim() || deviceNameFromSearch;
        const imageUrl = $detail(".specs-photo-main a img").attr("src");

        const detailSpec = [];
        $detail("#specs-list table").each((i, table) => {
            const category = $detail(table).find("th").first().text().trim();
            const specifications = [];

            $detail(table).find("tr").each((j, row) => {
                const specNameElement = $detail(row).find("td.ttl a");
                const specValueElement = $detail(row).find("td.nfo");

                if (specNameElement.length > 0 && specValueElement.length > 0) {
                    const name = specNameElement.text().trim();
                    // Preserve line breaks within the value, clean up excessive whitespace
                    const value = specValueElement.html().replace(/<br\s*\/?>/gi, "\n").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
                    specifications.push({ name, value });
                }
            });

            if (category && specifications.length > 0) {
                detailSpec.push({ category, specifications });
            }
        });

        console.log(`[Scraper] Successfully scraped details for ${deviceName}`);
        return {
            name: deviceName,
            img: imageUrl,
            detailSpec: detailSpec
        };

    } catch (error) {
        console.error(`[Scraper] Custom scraping failed for query \"${query}\":`, error.message);
        // Log the stack trace for better debugging during testing phase
        // console.error(error.stack);
        // Return a more informative error message
        return { error: `Scraping failed: ${error.message || 'Unknown error during scraping process'}` };
    }
}

module.exports = { scrapeGsmarena };

