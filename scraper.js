#!/usr/bin/env node
const axios = require("axios");
const cheerio = require("cheerio");

// --- Configuration ---
const CRAWLBASE_API_TOKEN = "JVQkq9LLyulShydkElsbSQ"; // Replace with your actual token if different
const CRAWLBASE_API_URL = "https://api.crawlbase.com/";
const GSMARENA_BASE_URL = "https://www.gsmarena.com/";

// --- Helper Functions ---
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches a GSMArena URL via the Crawlbase API.
 * Handles retries specifically for Crawlbase 429 errors.
 */
async function fetchViaCrawlbase(targetUrl, retries = 3, delayMs = 1000) {
    const fullTargetUrl = targetUrl.startsWith("http") ? targetUrl : `${GSMARENA_BASE_URL}${targetUrl}`;
    const crawlbaseUrl = `${CRAWLBASE_API_URL}?token=${CRAWLBASE_API_TOKEN}&url=${encodeURIComponent(fullTargetUrl)}`;
    console.log(`[Crawlbase] Fetching: ${fullTargetUrl} (Attempt ${4 - retries})`);

    try {
        const response = await axios.get(crawlbaseUrl, {
            timeout: 90000 // 90 seconds timeout as suggested
        });
        // Crawlbase returns original status code in 'original_status' header
        const originalStatus = response.headers["original_status"];
        console.log(`[Crawlbase] Fetched ${fullTargetUrl}. Original Status: ${originalStatus}`);

        if (response.status === 200 && response.data) {
            // Check if Crawlbase itself indicates an error with the original request
            if (originalStatus && parseInt(originalStatus, 10) >= 400) {
                 console.warn(`[Crawlbase] Original request to ${fullTargetUrl} failed with status ${originalStatus}. Body might contain error page.`);
                 // Decide if you want to throw an error here or let the parser handle it
                 // For now, let's return the body, the parser should handle missing elements
            }
            return response.data; // Return HTML content
        } else {
            throw new Error(`Crawlbase request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error(`[Crawlbase] Error fetching ${fullTargetUrl}:`, error.message);
        // Check specifically for Crawlbase rate limit (though less likely than GSMArena's)
        if (error.response && error.response.status === 429 && retries > 0) {
            console.warn(`[Crawlbase] Rate limit hit (429). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
            await delay(delayMs);
            return fetchViaCrawlbase(targetUrl, retries - 1, delayMs * 2);
        } else if (error.code === 'ECONNABORTED') {
             console.error(`[Crawlbase] Timeout fetching ${fullTargetUrl}`);
             throw new Error(`Timeout fetching URL via Crawlbase: ${fullTargetUrl}`);
        }
        // Re-throw other errors or if retries exhausted
        throw error;
    }
}

/**
 * Scrapes GSMArena using Crawlbase for both search and detail pages.
 */
async function scrapeGsmarena(query) {
    console.log(`[Scraper] Starting custom scrape for query: ${query}`);
    try {
        // 1. Search for the device via Crawlbase
        const searchUrl = `results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;
        const searchHtml = await fetchViaCrawlbase(searchUrl);
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

        // 3. Fetch the device detail page via Crawlbase
        const detailHtml = await fetchViaCrawlbase(devicePageUrl);
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
        console.error(`[Scraper] Custom scraping failed for query "${query}":`, error.message);
        // Don't log full stack here unless debugging, message should be enough
        // console.error(error.stack);
        return { error: `Scraping failed: ${error.message || 'Unknown error'}` };
    }
}

module.exports = { scrapeGsmarena };

