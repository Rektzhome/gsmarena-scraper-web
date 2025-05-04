const gsmarena = require("gsmarena-api");

// Helper function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeGsmarena(query, retries = 5, delayMs = 2000) {
    console.log(`[Scraper] Starting search for query: ${query} using gsmarena-api (Attempt ${6 - retries})`); // Adjusted retry count log
    try {
        // Search for devices first to get the device ID
        const devices = await gsmarena.search.search(query);
        if (!devices || devices.length === 0) {
            console.log(`[Scraper] No devices found for query: ${query}`);
            return { error: `No devices found for query: ${query}` };
        }

        // Assume the first result is the most relevant
        const deviceId = devices[0].id;
        console.log(`[Scraper] Found device ID: ${deviceId} for the first result: ${devices[0].name}`);

        // Get the full device details using the ID
        console.log(`[Scraper] Fetching details for device ID: ${deviceId}`);
        const details = await gsmarena.catalog.getDevice(deviceId);
        console.log(`[Scraper] Successfully fetched details for ${details.name}`);
        
        // The API returns a slightly different structure, let's adapt it slightly if needed
        // For now, return the raw details from the API
        return details;

    } catch (error) {
        console.error(`[Scraper] Error details: ${JSON.stringify(error)}`); // Log full error object
        console.error(`[Scraper] Error stack: ${error.stack}`);

        // Check if it's a rate limit error (429)
        if (error.status === 429 && retries > 0) {
            console.warn(`[Scraper] Rate limit hit (429). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
            await delay(delayMs);
            // Retry with one less retry attempt and double the delay (exponential backoff)
            return scrapeGsmarena(query, retries - 1, delayMs * 2);
        }

        // Return a structured error for other errors or if retries are exhausted
        return { error: `API request failed: ${error.message || 'Unknown error'}` };
    }
}

module.exports = { scrapeGsmarena };

