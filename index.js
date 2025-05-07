const express = require("express");
const path = require("path");
const axios = require("axios"); // Import axios
const { searchDevices, getDeviceDetails } = require("./scraper"); // Ensure this line is correct

const app = express();
const port = process.env.PORT || 3000;

// Simple in-memory cache for scraped data
const cache = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour for scraped data

// Cache for exchange rates
const exchangeRateCache = {
    rates: null,
    baseCurrency: 'USD',
    timestamp: 0,
};
const RATE_CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours for exchange rates
const CURRENCY_API_KEY = "fca_live_S9jkdJiYdOutHpdsHVvUtQyNDzaZ34ck2oBa0uyM";
const TARGET_CURRENCIES = "IDR,EUR,INR,GBP,AUD,CAD";
const CURRENCY_API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${CURRENCY_API_KEY}&currencies=${TARGET_CURRENCIES}&base_currency=${exchangeRateCache.baseCurrency}`;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// --- Helper Functions ---

async function getExchangeRates() {
    const now = Date.now();
    if (exchangeRateCache.rates && (now - exchangeRateCache.timestamp < RATE_CACHE_DURATION_MS)) {
        console.log(`[Currency] Using cached exchange rates (Base: ${exchangeRateCache.baseCurrency}).`);
        return exchangeRateCache.rates;
    }
    console.log(`[Currency] Fetching fresh exchange rates (Base: ${exchangeRateCache.baseCurrency}, Targets: ${TARGET_CURRENCIES})...`);
    try {
        const response = await axios.get(CURRENCY_API_URL);
        if (response.data && response.data.data) {
            const rates = {
                 ...response.data.data,
                 [exchangeRateCache.baseCurrency]: 1
                };
            exchangeRateCache.rates = rates;
            exchangeRateCache.timestamp = now;
            console.log("[Currency] Rates fetched and cached:", rates);
            return rates;
        } else {
            console.error("[Currency] Invalid API response structure:", response.data);
            return exchangeRateCache.rates; // Return old rates if new fetch fails but old ones exist
        }
    } catch (error) {
        console.error("[Currency] Error fetching exchange rates:", error.message);
        return exchangeRateCache.rates; // Return old rates if new fetch fails
    }
}

function formatIDR(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return "";
    }
    const roundedAmount = Math.round(amount);
    const formattedAmount = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formattedAmount}`;
}

async function convertPrice(priceString) {
    if (!priceString || typeof priceString !== 'string') {
        return priceString;
    }
    const rates = await getExchangeRates();
    if (!rates || !rates.IDR) {
        console.warn("[Currency] Conversion skipped: No exchange rates available or IDR rate missing.");
        return priceString;
    }
    const currencyMap = {
        '$': 'USD', 'USD': 'USD', '€': 'EUR', 'EUR': 'EUR',
        '₹': 'INR', 'INR': 'INR', '£': 'GBP', 'GBP': 'GBP',
        'A$': 'AUD', 'AUD': 'AUD', 'C$': 'CAD', 'CAD': 'CAD'
    };
    const pricePartRegex = /(?:About\s*)?([$€₹£]|A\$|C\$)?\s*([\d,.]+)(?:\s*(USD|EUR|INR|GBP|AUD|CAD))?/gi;
    let match;
    let firstConvertedIDR = null;
    while ((match = pricePartRegex.exec(priceString)) !== null) {
        const symbol = match[1];
        let amountStr = match[2].replace(/,/g, '');
        const code = match[3];
        const amount = parseFloat(amountStr);
        if (isNaN(amount)) continue;
        let sourceCurrency = null;
        if (symbol && currencyMap[symbol]) {
            sourceCurrency = currencyMap[symbol];
        } else if (code && currencyMap[code.toUpperCase()]) {
            sourceCurrency = currencyMap[code.toUpperCase()];
        }
        if (sourceCurrency && rates[sourceCurrency]) {
            try {
                const rateSourceToBase = rates[sourceCurrency]; 
                const rateIdrToBase = rates.IDR;
                const convertedAmountIDR = amount * (rateIdrToBase / rateSourceToBase);
                if (!isNaN(convertedAmountIDR)) {
                    firstConvertedIDR = formatIDR(convertedAmountIDR);
                    console.log(`[Currency] Converted ${amount} ${sourceCurrency} to ${firstConvertedIDR}`);
                    break; 
                }
            } catch (calcError) {
                console.error(`[Currency] Error calculating conversion for ${sourceCurrency}:`, calcError);
            }
        }
    }
    if (firstConvertedIDR) {
        return `${priceString} / ${firstConvertedIDR}`;
    }
    console.warn(`[Currency] No convertible currency found in: ${priceString}`);
    return priceString;
}

// --- API Endpoint for Device Search ---
app.get("/api/search", async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }
    const cacheKey = `search_${query.toLowerCase().trim()}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
        console.log(`[Cache] HIT for search query: ${query}`);
        return res.status(200).json(cachedData.data);
    }
    console.log(`[Cache] MISS for search query: ${query}. Proceeding to search.`);
    try {
        const searchResult = await searchDevices(query);
        if (searchResult.error) {
            console.error(`Search error for query '${query}':`, searchResult.error);
            if (searchResult.error.includes("No devices found")) {
                 res.status(404).json(searchResult);
            } else {
                 res.status(500).json({ error: searchResult.error });
            }
        } else {
            console.log(`[Cache] Storing result for search query: ${query}`);
            cache.set(cacheKey, { data: searchResult, timestamp: Date.now() });
            res.status(200).json(searchResult);
        }
    } catch (error) {
        console.error(`Server error processing search query '${query}':`, error);
        res.status(500).json({ error: "Internal server error during search process." });
    }
});

// --- API Endpoint for Device Details ---
app.get("/api/details", async (req, res) => {
    const deviceUrl = req.query.url;
    if (!deviceUrl) {
        return res.status(400).json({ error: "URL parameter is required" });
    }
    const cacheKey = `details_${deviceUrl.toLowerCase().trim()}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
        console.log(`[Cache] HIT for details URL: ${deviceUrl}`);
        return res.status(200).json(cachedData.data);
    }
    console.log(`[Cache] MISS for details URL: ${deviceUrl}. Proceeding to fetch details.`);
    try {
        let details = await getDeviceDetails(deviceUrl);
        if (details.error) {
            console.error(`Detail fetching error for URL '${deviceUrl}':`, details.error);
            if (details.error.includes("Failed to extract details")) {
                 res.status(404).json(details);
            } else if (details.error.includes("Detail scraping failed")) {
                 res.status(500).json({ error: "Detail scraping failed internally. Please try again later." });
            } else {
                 res.status(500).json({ error: details.error });
            }
        } else {
            if (details.detailSpec && Array.isArray(details.detailSpec)) {
                console.log(`[Currency] Attempting price conversion for: ${details.name}`);
                details.detailSpec = await Promise.all(details.detailSpec.map(async (category) => {
                    if (category.category === "Misc" && Array.isArray(category.specifications)) {
                        category.specifications = await Promise.all(category.specifications.map(async (specItem) => {
                            let specObject = null;
                            let successfullyProcessed = false;
                            try {
                                if (typeof specItem === 'object' && specItem !== null) {
                                    specObject = specItem; 
                                    successfullyProcessed = true;
                                } else if (typeof specItem === 'string' && specItem.trim().startsWith('{')) {
                                    specObject = JSON.parse(specItem); 
                                    successfullyProcessed = true;
                                }
                            } catch (e) {
                                console.warn(`[Misc Processing] Failed to parse spec item in Misc: '${specItem}'. Error:`, e.message);
                                return specItem; 
                            }

                            if (successfullyProcessed && specObject) {
                                if (specObject.name === "Price" && specObject.value) {
                                    specObject.value = await convertPrice(specObject.value);
                                }
                                return specObject; // Return the processed object
                            } else {
                                console.warn(`[Misc Processing] Item was not an object and could not be parsed, or specObject is null: '${specItem}'`);
                                return specItem; 
                            }
                        }));
                    }
                    return category;
                }));
            }
            let priceIDR = null;
            const miscCategory = details.detailSpec?.find(cat => cat.category === "Misc");
            if (miscCategory && Array.isArray(miscCategory.specifications)) {
                for (const specItem of miscCategory.specifications) {
                    // Ensure specItem is an object before accessing its properties
                    if (typeof specItem === 'object' && specItem !== null && specItem.name === "Price" && specItem.value && typeof specItem.value === 'string') {
                        const priceParts = specItem.value.split(' / ');
                        if (priceParts.length === 2 && priceParts[1].startsWith('Rp')) {
                            priceIDR = priceParts[1];
                            console.log(`[Currency] Extracted priceIDR for card: ${priceIDR}`);
                            break;
                        }
                    }
                }
            }
            details.priceIDR = priceIDR;
            console.log(`[Cache] Storing result for details URL: ${deviceUrl}`);
            cache.set(cacheKey, { data: details, timestamp: Date.now() });
            res.status(200).json(details);
        }
    } catch (error) {
        console.error(`Server error processing details URL '${deviceUrl}':`, error);
        res.status(500).json({ error: "Internal server error during detail fetching process." });
    }
});

// Start the server - Listen on 0.0.0.0 for external accessibility
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
    getExchangeRates(); 
});

// Export the app for Vercel (or other platforms)
module.exports = app;

