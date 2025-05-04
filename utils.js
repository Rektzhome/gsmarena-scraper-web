const axios = require("axios");

// User-Agent provided by the user (might not be used by Crawlbase API, but keep for reference)
const customUserAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36";

// Crawlbase Crawling API details
const crawlbaseToken = "yW4Xkf48-tpIpcwLCJWxvA"; // Use the JavaScript token
const crawlbaseApiEndpoint = "https://api.crawlbase.com/";

exports.getDataFromUrl = async (url) => {
    // Construct the target GSMArena URL
    const targetGsmarenaUrl = `https://www.gsmarena.com${url}`;
    console.log(`[gsmarena-api] Fetching URL: ${targetGsmarenaUrl} via Crawlbase Crawling API (JS Token)`);

    try {
        // Construct the Crawlbase API request URL
        const crawlbaseUrl = `${crawlbaseApiEndpoint}?token=${crawlbaseToken}&url=${encodeURIComponent(targetGsmarenaUrl)}`;
        
        console.log(`[gsmarena-api] Calling Crawlbase API: ${crawlbaseUrl}`);

        const response = await axios({
            method: "get",
            url: crawlbaseUrl,
            // No proxy or special httpsAgent needed when calling the API directly
            // Crawlbase handles the fetching and potential JS rendering
            // Set a reasonable timeout based on user info (e.g., 90 seconds)
            timeout: 90000 // 90 seconds in milliseconds
        });

        // Check if Crawlbase returned a successful response with the HTML content
        // Crawlbase API might return different status codes or response structures on error
        if (response.status === 200 && response.data) {
            console.log("[gsmarena-api] Successfully fetched data via Crawlbase Crawling API.");
            // The response.data should contain the HTML of the targetGsmarenaUrl
            return response.data;
        } else {
            // Handle potential Crawlbase API errors (e.g., invalid token, usage limit)
            console.error(`[gsmarena-api] Crawlbase API returned status ${response.status}`);
            throw new Error(`Crawlbase API request failed with status ${response.status}`);
        }

    } catch (error) {
        // Log Axios errors during the call to Crawlbase API
        if (error.response) {
            console.error(`[gsmarena-api] Error calling Crawlbase API: Status ${error.response.status}`, error.message);
            if (error.response.data) {
                console.error("[gsmarena-api] Crawlbase API error response data:", error.response.data);
            }
             // Add status to the error object for scraper.js
            error.status = error.response.status; 
        } else if (error.request) {
            console.error("[gsmarena-api] Error calling Crawlbase API: No response received", error.message);
        } else {
            console.error("[gsmarena-api] Error setting up Crawlbase API request", error.message);
        }
        throw error;
    }
};

exports.getPrice = (text) => {
    // Ensure text is a string before attempting to replace/split
    if (typeof text !== 'string') {
        console.error('[gsmarena-api] getPrice received non-string input:', text);
        return { currency: null, price: null }; // Return default/error value
    }
    const value = text.replace(",", "").split("\u2009"); // Use unicode for thin space
    // Add validation for expected format
    if (value.length < 2 || isNaN(parseFloat(value[1]))) {
         console.warn('[gsmarena-api] Unexpected format for getPrice:', text);
         return { currency: value[0] || null, price: null }; // Return currency if available, price as null
    }
    return {
        currency: value[0],
        price: parseFloat(value[1]),
    };
};
