#!/usr/bin/env node
const axios = require("axios");
const cheerio = require("cheerio");
// HttpsProxyAgent is not needed if Axios handles proxy correctly with separate ports
// const { HttpsProxyAgent } = require("https-proxy-agent");

// --- Configuration ---
const CRAWLBASE_API_TOKEN = "JVQkq9LLyulShydkElsbSQ"; // User provided token
const GSMARENA_BASE_URL = "https://www.gsmarena.com/";
// Use Crawlbase Smart Proxy configuration with correct ports
const CRAWLBASE_PROXY_HOST = "smartproxy.crawlbase.com";
const CRAWLBASE_HTTP_PORT = 8010; // Port for HTTP targets
const CRAWLBASE_HTTPS_PORT = 8011; // Port for HTTPS targets (as per documentation text)

// --- Helper Functions ---
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Construct proxy URLs for HTTP and HTTPS
const httpProxyUrl = `http://${CRAWLBASE_API_TOKEN}:@${CRAWLBASE_PROXY_HOST}:${CRAWLBASE_HTTP_PORT}`;
const httpsProxyUrl = `http://${CRAWLBASE_API_TOKEN}:@${CRAWLBASE_PROXY_HOST}:${CRAWLBASE_HTTPS_PORT}`;

/**
 * Fetches a GSMArena URL via the Crawlbase Smart Proxy (Proxy Mode) using correct ports.
 * Handles retries for specific errors like timeouts or potential proxy errors.
 */
async function fetchViaCrawlbase(targetUrl, retries = 3, delayMs = 1000) {
    const fullTargetUrl = targetUrl.startsWith("http") ? targetUrl : `${GSMARENA_BASE_URL}${targetUrl}`;
    const isHttps = fullTargetUrl.startsWith("https");

    console.log(`[Crawlbase Axios Proxy] Fetching: ${fullTargetUrl} via ${CRAWLBASE_PROXY_HOST}:${isHttps ? CRAWLBASE_HTTPS_PORT : CRAWLBASE_HTTP_PORT} (Attempt ${4 - retries})`);

    try {
        const response = await axios.get(fullTargetUrl, {
            // Configure Axios proxy settings using separate URLs for http and https
            proxy: false, // Disable default proxy handling if we set agents
            httpAgent: isHttps ? undefined : require('http').Agent({ proxy: httpProxyUrl }), // Standard http agent might not support proxy auth this way
            httpsAgent: isHttps ? require('https').Agent({ proxy: httpsProxyUrl }) : undefined, // Standard https agent might not support proxy auth this way
            // Let's try the Axios native proxy config again, but with correct URLs
            proxy: {
                protocol: isHttps ? 'https' : 'http',
                host: CRAWLBASE_PROXY_HOST,
                port: isHttps ? CRAWLBASE_HTTPS_PORT : CRAWLBASE_HTTP_PORT,
                auth: {
                    username: CRAWLBASE_API_TOKEN,
                    password: '' // Password is empty as per documentation
                }
            },
            timeout: 90000, // 90 seconds timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            }
        });

        console.log(`[Crawlbase Axios Proxy] Fetched ${fullTargetUrl}. Status: ${response.status}`);

        if (response.status === 200 && response.data) {
            return response.data; // Return HTML content
        } else {
            console.warn(`[Crawlbase Axios Proxy] Target server responded with status ${response.status} for ${fullTargetUrl}`);
            throw new Error(`Target server request failed via proxy with status ${response.status}`);
        }
    } catch (error) {
        console.error(`[Crawlbase Axios Proxy] Error fetching ${fullTargetUrl}:`, error.message);
        if (error.code) {
            console.error(`[Crawlbase Axios Proxy] Error Code: ${error.code}`);
        }
        // Log proxy details if it's a proxy error
        if (error.config && error.config.proxy) {
             console.error(`[Crawlbase Axios Proxy] Proxy Config Used: ${JSON.stringify(error.config.proxy)}`);
        }

        let shouldRetry = false;
        if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
             console.warn(`[Crawlbase Axios Proxy] Timeout fetching ${fullTargetUrl}. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
             shouldRetry = true;
        } else if (error.response) {
            console.error(`[Crawlbase Axios Proxy] Received error status: ${error.response.status}`);
            if (error.response.status === 407) {
                 console.error("[Crawlbase Axios Proxy] Proxy Authentication Failed (407). Check your API Token and proxy config.");
            } else if (error.response.status === 429) {
                 console.warn(`[Crawlbase Axios Proxy] Received 429 (Too Many Requests). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
                 shouldRetry = true;
            } else if (error.response.status >= 500) {
                 console.warn(`[Crawlbase Axios Proxy] Received server error ${error.response.status}. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
                 shouldRetry = true;
            }
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN' || error.code === 'ECONNRESET') {
            console.warn(`[Crawlbase Axios Proxy] Network error (${error.code}). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
            shouldRetry = true;
        } else {
             console.warn(`[Crawlbase Axios Proxy] Other error. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
             shouldRetry = true;
        }

        if (shouldRetry && retries > 0) {
            await delay(delayMs);
            return fetchViaCrawlbase(targetUrl, retries - 1, delayMs * 2);
        }

        const errorMessage = error.response ? `Status ${error.response.status}` : (error.code ? `${error.code} - ${error.message}` : error.message);
        throw new Error(`Failed to fetch ${fullTargetUrl} via Crawlbase proxy after multiple retries: ${errorMessage}`);
    }
}

/**
 * Scrapes GSMArena using Crawlbase for both search and detail pages.
 */
async function scrapeGsmarena(query) {
    console.log(`[Scraper] Starting custom scrape for query: ${query}`);
    try {
        // 1. Search for the device via Crawlbase Proxy (using correct ports)
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
        const deviceNameFromSearch = deviceLink.find("strong").text().trim();
        console.log(`[Scraper] Found first device link: ${devicePageUrl} (${deviceNameFromSearch})`);

        if (!devicePageUrl) {
             console.error("[Scraper] Could not extract device page URL from search results.");
             return { error: "Failed to parse search results."};
        }

        // 3. Fetch the device detail page via Crawlbase Proxy (using correct ports)
        // Ensure the URL is absolute before passing to fetchViaCrawlbase
        const absoluteDevicePageUrl = devicePageUrl.startsWith('http') ? devicePageUrl : `${GSMARENA_BASE_URL}${devicePageUrl}`;
        const detailHtml = await fetchViaCrawlbase(absoluteDevicePageUrl); // Uses the updated function
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
        // console.error(error.stack); // Uncomment for detailed stack trace if needed
        return { error: `Scraping failed: ${error.message || 'Unknown error during scraping process'}` };
    }
}

module.exports = { scrapeGsmarena };

