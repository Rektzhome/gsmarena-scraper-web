const express = require("express");
const path = require("path");
const { getMockData } = require("./scraper"); // Changed import

const app = express();
const port = process.env.PORT || 3000;

// Simple in-memory cache with expiration (less critical now, but can keep)
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

    console.log(`[Cache] MISS for query: ${query}. Using mock data.`);

    try {
        // Use mock data function instead of scraper
        const details = getMockData(query);

        if (details.error) {
            // Log the specific error for debugging
            console.error(`Mock data error for query '${query}':`, details.error);
            // If mock data function returned an error (e.g., not found)
            if (details.error.includes("No mock data")) {
                 res.status(404).json(details);
            } else {
                 // Handle other potential errors
                 res.status(500).json({ error: details.error });
            }
        } else {
            // Store successful result in cache
            console.log(`[Cache] Storing mock result for query: ${query}`);
            cache.set(cacheKey, { data: details, timestamp: Date.now() });
            res.status(200).json(details);
        }
    } catch (error) {
        // Catch unexpected errors during the process
        console.error(`Server error processing query '${query}':`, error);
        res.status(500).json({ error: "Internal server error processing mock data." });
    }
});

// Start the server - Listen on 0.0.0.0 for external accessibility
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel
module.exports = app;
