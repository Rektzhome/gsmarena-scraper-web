const gsmarena = require("gsmarena-api");

async function scrapeGsmarena(query) {
    console.log(`[Scraper] Starting search for query: ${query} using gsmarena-api`);
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
        console.error(`[Scraper] Error using gsmarena-api: ${error}`);
        console.error(`[Scraper] Error stack: ${error.stack}`);
        // Return a structured error consistent with previous attempts
        return { error: `API request failed: ${error.message}` };
    }
}

module.exports = { scrapeGsmarena };

