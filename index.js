const express = require("express");
const path = require("path");
const axios = require("axios"); // Import axios
const { scrapeGsmarena } = require("./scraper");

const app = express();
const port = process.env.PORT || 3000;

// Simple in-memory cache for scraped data
const cache = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour for scraped data

// Cache for exchange rates
const exchangeRateCache = {
    rates: null,
    timestamp: 0,
};
const RATE_CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours for exchange rates
const CURRENCY_API_KEY = "fca_live_S9jkdJiYdOutHpdsHVvUtQyNDzaZ34ck2oBa0uyM";
const CURRENCY_API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${CURRENCY_API_KEY}&currencies=IDR&base_currency=USD`;
const CURRENCY_API_URL_EUR = `https://api.freecurrencyapi.com/v1/latest?apikey=${CURRENCY_API_KEY}&currencies=IDR&base_currency=EUR`;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// --- Helper Functions ---

// Function to fetch and cache exchange rates
async function getExchangeRates() {
    const now = Date.now();
    if (exchangeRateCache.rates && (now - exchangeRateCache.timestamp < RATE_CACHE_DURATION_MS)) {
        console.log("[Currency] Using cached exchange rates.");
        return exchangeRateCache.rates;
    }

    console.log("[Currency] Fetching fresh exchange rates...");
    try {
        // Fetch both USD->IDR and EUR->IDR
        const [responseUsd, responseEur] = await Promise.all([
            axios.get(CURRENCY_API_URL),
            axios.get(CURRENCY_API_URL_EUR)
        ]);

        if (responseUsd.data && responseUsd.data.data && responseUsd.data.data.IDR &&
            responseEur.data && responseEur.data.data && responseEur.data.data.IDR) {
            const rates = {
                USD_IDR: responseUsd.data.data.IDR,
                EUR_IDR: responseEur.data.data.IDR,
            };
            exchangeRateCache.rates = rates;
            exchangeRateCache.timestamp = now;
            console.log("[Currency] Rates fetched and cached:", rates);
            return rates;
        } else {
            console.error("[Currency] Invalid API response structure:", responseUsd.data, responseEur.data);
            // Return old rates if available, otherwise null
            return exchangeRateCache.rates;
        }
    } catch (error) {
        console.error("[Currency] Error fetching exchange rates:", error.message);
        // Return old rates if available, otherwise null
        return exchangeRateCache.rates;
    }
}

// Function to format number as IDR currency
function formatIDR(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return "";
    }
    // Round to nearest integer
    const roundedAmount = Math.round(amount);
    // Format with dots as thousands separators
    const formattedAmount = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formattedAmount}`;
}

// Function to parse price string and convert
async function convertPrice(priceString) {
    if (!priceString || typeof priceString !== 'string') {
        return priceString; // Return original if invalid
    }

    const rates = await getExchangeRates();
    if (!rates) {
        console.warn("[Currency] Conversion skipped: No exchange rates available.");
        return priceString; // Return original if rates not available
    }

    // Regex to find currency symbol (€ or $) and amount
    // Handles formats like "About 1200 EUR", "€ 1100", "$ 999", "1000 USD"
    const priceRegex = /(?:About\s*)?([€$])?\s*([\d,.]+)(?:\s*(EUR|USD))?/i;
    const match = priceString.match(priceRegex);

    if (match) {
        const symbol = match[1];
        let amountStr = match[2].replace(/,/g, ''); // Remove commas for parsing
        const currencyCode = match[3];
        const amount = parseFloat(amountStr);

        if (!isNaN(amount)) {
            let convertedAmountIDR = null;
            let originalCurrency = null;

            // Determine currency and convert
            if ((symbol === '€' || (currencyCode && currencyCode.toUpperCase() === 'EUR')) && rates.EUR_IDR) {
                convertedAmountIDR = amount * rates.EUR_IDR;
                originalCurrency = "EUR";
            } else if ((symbol === '$' || (currencyCode && currencyCode.toUpperCase() === 'USD')) && rates.USD_IDR) {
                convertedAmountIDR = amount * rates.USD_IDR;
                originalCurrency = "USD";
            }

            if (convertedAmountIDR !== null) {
                const formattedIDR = formatIDR(convertedAmountIDR);
                // Return original string + formatted IDR
                return `${priceString} / ${formattedIDR}`;
            }
        }
    }

    // If no match or conversion failed, return the original string
    return priceString;
}

// --- API Endpoint ---
app.get("/api/scrape", async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    const cacheKey = query.toLowerCase().trim();
    const cachedData = cache.get(cacheKey);

    // Check if valid cached data exists
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
        console.log(`[Cache] HIT for query: ${query}`);
        return res.status(200).json(cachedData.data);
    }

    console.log(`[Cache] MISS for query: ${query}. Proceeding to scrape.`);

    try {
        let details = await scrapeGsmarena(query);

        if (details.error) {
            console.error(`Scraping error for query '${query}':`, details.error);
            if (details.error.includes("No phone found")) {
                 res.status(404).json(details);
            } else if (details.error.includes("API request failed")) {
                 res.status(500).json({ error: "Scraping failed internally. Please try again later." });
            } else {
                 res.status(500).json({ error: details.error });
            }
        } else {
            // --- Price Conversion Logic ---
            if (details.detailSpec && Array.isArray(details.detailSpec)) {
                console.log(`[Currency] Attempting price conversion for: ${details.name}`);
                details.detailSpec = await Promise.all(details.detailSpec.map(async (category) => {
                    if (category.category === "Misc" && Array.isArray(category.specifications)) {
                        category.specifications = await Promise.all(category.specifications.map(async (specString) => {
                            let wasParsed = false;
                            let spec = null;
                            try {
                                // Only attempt parse if it looks like JSON (starts with {)
                                if (typeof specString === 'string' && specString.trim().startsWith('{')) {
                                    spec = JSON.parse(specString);
                                    wasParsed = true;
                                }
                            } catch (e) {
                                console.warn(`[Currency] Failed to parse spec string in Misc: ${specString}`, e);
                                // Keep specString as is if parsing fails
                            }

                            // If successfully parsed and is the Price spec, convert it
                            if (wasParsed && spec && spec.name === "Price" && spec.value) {
                                console.log(`[Currency] Found price spec: ${spec.value}`);
                                spec.value = await convertPrice(spec.value);
                                console.log(`[Currency] Converted price spec: ${spec.value}`);
                                // Return the modified spec object as a stringified JSON
                                return JSON.stringify(spec);
                            }
                            // If it was parsed but not the Price spec, stringify it back
                            else if (wasParsed && spec) {
                                return JSON.stringify(spec);
                            }
                            // Otherwise (not JSON or parsing failed), return the original string
                            else {
                                return specString;
                            }
                        }));
                    }
                    return category; // Return category unchanged if not Misc or no specs
                }));
            }
            // --- End Price Conversion Logic ---

            // Store successful result (with converted price) in cache
            console.log(`[Cache] Storing result for query: ${query}`);
            cache.set(cacheKey, { data: details, timestamp: Date.now() });
            res.status(200).json(details);
        }
    } catch (error) {
        // Log the detailed error on the server
        console.error(`Server error processing query '${query}':`, error);
        // Send a generic error response to the client
        res.status(500).json({ error: "Internal server error during scraping process." });
    }
});

// Start the server - Listen on 0.0.0.0 for external accessibility
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
    // Pre-fetch rates on startup (optional)
    getExchangeRates();
});

// Export the app for Vercel (or other platforms)
module.exports = app;
