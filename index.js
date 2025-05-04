const express = require("express");
const path = require("path");
const { scrapeGsmarena } = require("./scraper");

const app = express();
const port = process.env.PORT || 3000;

// Simple in-memory cache with expiration
const cache = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the API endpoint
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
        const details = await scrapeGsmarena(query);
        if (details.error) {
            // Log the specific error for debugging
            console.error(`Scraping error for query '${query}':`, details.error);
            // If scraper returned an error object, send appropriate status
            if (details.error.includes("No phone found")) {
                 res.status(404).json(details);
            } else if (details.error.includes("API request failed")) {
                 // Keep the generic error for rate limit or other API failures after retries
                 res.status(500).json({ error: "Scraping failed internally. Please try again later." });
            } else {
                 // Handle other potential scraper errors
                 res.status(500).json({ error: details.error });
            }
        } else {
            // Store successful result in cache
            console.log(`[Cache] Storing result for query: ${query}`);
            cache.set(cacheKey, { data: details, timestamp: Date.now() });
            res.status(200).json(details);
        }
    } catch (error) {
        // Catch unexpected errors during the process
        console.error(`Server error processing query '${query}':`, error);
        res.status(500).json({ error: "Internal server error during scraping process." });
    }
});

// Start the server - Listen on 0.0.0.0 for external accessibility
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel
module.exports = app;
