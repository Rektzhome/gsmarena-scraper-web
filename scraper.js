// const gsmarena = require("gsmarena-api"); // Commented out problematic dependency

// Helper function for delay (kept in case needed elsewhere, but not for mock data)
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Mock data function
function getMockData(query) {
    console.log(`[Mock Data] Generating mock data for query: ${query}`);
    const lowerQuery = query.toLowerCase();

    // Sample mock data structure (mimicking gsmarena-api output)
    const mockDatabase = {
        "samsung galaxy s24": {
            "name": "Samsung Galaxy S24 (Mock)",
            "img": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg", // Example image
            "detailSpec": [
                {
                    "category": "Network",
                    "specifications": [
                        { "name": "Technology", "value": "GSM / CDMA / HSPA / EVDO / LTE / 5G" },
                        { "name": "Status", "value": "Available. Released 2024, January" }
                    ]
                },
                {
                    "category": "Body",
                    "specifications": [
                        { "name": "Dimensions", "value": "147 x 70.6 x 7.6 mm" },
                        { "name": "Weight", "value": "167 g" },
                        { "name": "Build", "value": "Glass front (Gorilla Glass Victus 2), glass back (Gorilla Glass Victus 2), aluminum frame" },
                        { "name": "SIM", "value": "Nano-SIM and eSIM or Dual SIM" }
                    ]
                },
                 {
                    "category": "Display",
                    "specifications": [
                        { "name": "Type", "value": "Dynamic LTPO AMOLED 2X, 120Hz, HDR10+, 2600 nits (peak)" },
                        { "name": "Size", "value": "6.2 inches, 94.4 cm2 (~88.6% screen-to-body ratio)" },
                        { "name": "Resolution", "value": "1080 x 2340 pixels, 19.5:9 ratio (~416 ppi density)" }
                    ]
                }
                // Add more categories as needed for testing
            ],
            "quickSpec": [
                { "name": "Display size", "value": "6.2\"" },
                { "name": "Display resolution", "value": "1080x2340 pixels" },
                { "name": "Camera pixels", "value": "50MP" },
                { "name": "Video pixels", "value": "8K" },
                { "name": "RAM size", "value": "8GB RAM" },
                { "name": "Chipset", "value": "Snapdragon 8 Gen 3 / Exynos 2400" },
                { "name": "Battery size", "value": "4000mAh" },
                { "name": "Battery type", "value": "Li-Ion" }
            ]
        },
        "iphone 15 pro": {
            "name": "iPhone 15 Pro (Mock)",
            "img": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg",
             "detailSpec": [
                {
                    "category": "Network",
                    "specifications": [
                        { "name": "Technology", "value": "GSM / CDMA / HSPA / EVDO / LTE / 5G" }
                    ]
                },
                 {
                    "category": "Display",
                    "specifications": [
                        { "name": "Type", "value": "LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 2000 nits (HBM)" },
                        { "name": "Size", "value": "6.1 inches" }
                    ]
                }
            ],
            "quickSpec": [
                { "name": "Display size", "value": "6.1\"" },
                { "name": "Chipset", "value": "Apple A17 Pro" }
            ]
        }
        // Add more mock phones as needed
    };

    const result = mockDatabase[lowerQuery];

    if (result) {
        return result;
    } else {
        // Return a specific structure if no mock data is found for the query
        return { error: `No mock data found for query: ${query}` };
    }
}

/*
// Original scraper function (commented out)
async function scrapeGsmarena(query, retries = 5, delayMs = 2000) {
    console.log(`[Scraper] Starting search for query: ${query} using gsmarena-api (Attempt ${6 - retries})`);
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
        
        return details;

    } catch (error) {
        console.error(`[Scraper] Error details: ${JSON.stringify(error)}`); // Log full error object
        console.error(`[Scraper] Error stack: ${error.stack}`);

        // Check if it's a rate limit error (429)
        // Adjusted check based on observed error structure
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
*/

module.exports = { getMockData }; // Export the mock function

