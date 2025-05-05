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
    rates: null, // Will store rates relative to base currency, e.g., { USD: 1, IDR: 16400, EUR: 0.9, INR: 83 }
    baseCurrency: 'USD', // Define the base currency
    timestamp: 0,
};
const RATE_CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours for exchange rates
const CURRENCY_API_KEY = "fca_live_S9jkdJiYdOutHpdsHVvUtQyNDzaZ34ck2oBa0uyM";
// Define target currencies including IDR and common source currencies
const TARGET_CURRENCIES = "IDR,EUR,INR,GBP,AUD,CAD"; // Add more as needed
const CURRENCY_API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${CURRENCY_API_KEY}&currencies=${TARGET_CURRENCIES}&base_currency=${exchangeRateCache.baseCurrency}`;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// --- Helper Functions ---

// Function to fetch and cache exchange rates relative to a base currency (USD)
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
            // Add the base currency rate (1) to the fetched rates
            const rates = {
                 ...response.data.data,
                 [exchangeRateCache.baseCurrency]: 1 // Add base currency rate manually
                };
            exchangeRateCache.rates = rates;
            exchangeRateCache.timestamp = now;
            console.log("[Currency] Rates fetched and cached:", rates);
            return rates;
        } else {
            console.error("[Currency] Invalid API response structure:", response.data);
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

    const rates = await getExchangeRates(); // Rates relative to baseCurrency (USD)
    if (!rates || !rates.IDR) {
        console.warn("[Currency] Conversion skipped: No exchange rates available or IDR rate missing.");
        return priceString; // Return original if rates not available
    }

    // Map symbols/codes to ISO codes we might have rates for
    const currencyMap = {
        '$': 'USD',
        'USD': 'USD',
        '€': 'EUR',
        'EUR': 'EUR',
        '₹': 'INR',
        'INR': 'INR',
        '£': 'GBP',
        'GBP': 'GBP',
        'A$': 'AUD', // Assuming A$ for AUD
        'AUD': 'AUD',
        'C$': 'CAD', // Assuming C$ for CAD
        'CAD': 'CAD'
        // Add more mappings as needed
    };

    // Regex to find all potential price parts (symbol/code and amount)
    // Looks for optional symbol, amount, optional code, separated by optional " / "
    const pricePartRegex = /(?:About\s*)?([$€₹£]|A\$|C\$)?\s*([\d,.]+)(?:\s*(USD|EUR|INR|GBP|AUD|CAD))?/gi;
    let match;
    let firstConvertedIDR = null;

    while ((match = pricePartRegex.exec(priceString)) !== null) {
        const symbol = match[1];
        let amountStr = match[2].replace(/,/g, ''); // Remove commas
        const code = match[3];
        const amount = parseFloat(amountStr);

        if (isNaN(amount)) continue; // Skip if amount is not a number

        let sourceCurrency = null;
        if (symbol && currencyMap[symbol]) {
            sourceCurrency = currencyMap[symbol];
        } else if (code && currencyMap[code.toUpperCase()]) {
            sourceCurrency = currencyMap[code.toUpperCase()];
        }

        // Check if we have a rate for this source currency relative to the base (USD)
        if (sourceCurrency && rates[sourceCurrency]) {
            try {
                // Calculate conversion: Amount * (IDR rate / Source Currency rate)
                // All rates are relative to the base currency (USD)
                const rateSourceToBase = rates[sourceCurrency];
                const rateIdrToBase = rates.IDR;
                const convertedAmountIDR = amount * (rateIdrToBase / rateSourceToBase);

                if (!isNaN(convertedAmountIDR)) {
                    firstConvertedIDR = formatIDR(convertedAmountIDR);
                    console.log(`[Currency] Converted ${amount} ${sourceCurrency} to ${firstConvertedIDR}`);
                    break; // Stop after the first successful conversion
                }
            } catch (calcError) {
                console.error(`[Currency] Error calculating conversion for ${sourceCurrency}:`, calcError);
                // Continue to the next potential price part
            }
        }
    }

    // If a conversion was successful, append it
    if (firstConvertedIDR) {
        return `${priceString} / ${firstConvertedIDR}`;
    }

    // If no conversion happened, return the original string
    console.warn(`[Currency] No convertible currency found in: ${priceString}`);
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
    // if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
    //     console.log(`[Cache] HIT for query: ${query}`);
    //     return res.status(200).json(cachedData.data);
    // }

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
                            let spec = null;
                            let inputIsObject = false;
                            try {
                                // Check if the input is already an object
                                if (typeof specString === 'object' && specString !== null) {
                                    spec = specString;
                                    wasParsed = true;
                                    inputIsObject = true;
                                // Only attempt parse if it looks like JSON (starts with {)
                                } else if (typeof specString === 'string' && specString.trim().startsWith('{')) {
                                    spec = JSON.parse(specString);
                                    wasParsed = true;
                                }
                            } catch (e) {
                                console.warn(`[Currency] Failed to parse spec string in Misc: ${specString}`, e);
                                // Keep specString as is if parsing fails
                            }

                            // If successfully parsed/handled and is the Price spec, convert it
                            if (wasParsed && spec && spec.name === "Price" && spec.value) {
                                // console.log(`[Currency] Found price spec: ${spec.value}`);
                                spec.value = await convertPrice(spec.value);
                                // console.log(`[Currency] Converted price spec: ${spec.value}`);
                                // Return the modified spec object as a stringified JSON
                                return JSON.stringify(spec);
                            }
                            // If it was parsed/handled but not the Price spec, stringify it back if needed
                            else if (wasParsed && spec) {
                                // If the original input was an object, stringify it. If it was a parsed string, it's already stringified.
                                return inputIsObject ? JSON.stringify(spec) : specString;
                            }
                            // Otherwise (not JSON, not object, or parsing failed), return the original string
                            else {
                                return specString;
                            }
                        }));
                    }
                    return category; // Return category unchanged if not Misc or no specs
                }));
            }
            // --- End Price Conversion Logic ---

            // --- Extract Converted Price for Search Card ---
            let priceIDR = null;
            const miscCategory = details.detailSpec?.find(cat => cat.category === "Misc");
            // console.log("[Debug] Found Misc Category:", !!miscCategory); // Log if Misc category exists
            if (miscCategory && Array.isArray(miscCategory.specifications)) {
                // console.log("[Debug] Misc Specifications:", miscCategory.specifications); // Log all specs in Misc
                for (const specItem of miscCategory.specifications) { // Renamed variable for clarity
                    // console.log(`[Debug] Processing specItem: ${JSON.stringify(specItem)}`); // Log the current spec item
                    try {
                        let spec = null;
                        // Check if the item is a string that needs parsing, or already an object
                        if (typeof specItem === 'string' && specItem.trim().startsWith('{')) {
                             spec = JSON.parse(specItem);
                             // console.log("[Debug] Parsed spec:", spec);
                        } else if (typeof specItem === 'object' && specItem !== null) {
                             spec = specItem; // Use the object directly
                             // console.log("[Debug] Using spec object directly:", spec);
                        }

                        // Now check the spec object
                        if (spec && spec.name === "Price" && spec.value && typeof spec.value === 'string') {
                            // console.log(`[Debug] Found Price spec with value: ${spec.value}`); // Log the raw price value found
                            const priceParts = spec.value.split(' / ');
                            // console.log("[Debug] Price parts after split:", priceParts);
                            if (priceParts.length === 2 && priceParts[1].startsWith('Rp')) {
                                priceIDR = priceParts[1];
                                console.log(`[Currency] Extracted priceIDR for card: ${priceIDR}`);
                                break; // Found the price
                            }
                        }
                    } catch (e) {
                        console.warn(`[Currency] Failed to parse or extract price from spec item for card: ${JSON.stringify(specItem)}`, e);
                    }
                }
            }
            // Add the extracted price to the main details object
            details.priceIDR = priceIDR;
            // console.log(`[Debug] Final details.priceIDR: ${details.priceIDR}`); // Log the final extracted price
            // --- End Extract Converted Price ---

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
