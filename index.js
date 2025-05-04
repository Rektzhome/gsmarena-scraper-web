const express = require("express");
const path = require("path"); // Import path module
const { scrapeGsmarena } = require("./scraper");

const app = express();
const port = process.env.PORT || 3000; // Use Vercel's port or default to 3000

// Middleware to parse JSON requests (optional, but good practice)
app.use(express.json());

// Serve static files from the 'public' directory
// This middleware should automatically serve index.html for the root path '/'
app.use(express.static(path.join(__dirname, "public")));

// Define the API endpoint
app.get("/api/scrape", async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    console.log(`Received request for query: ${query}`);

    try {
        const details = await scrapeGsmarena(query);
        if (details.error) {
            // If scraper returned an error object, send appropriate status
            if (details.error.includes("No phone found")) {
                 res.status(404).json(details);
            } else {
                 // Log the specific error for debugging
                 console.error(`Scraping error for query '${query}': ${details.error}`); 
                 res.status(500).json({ error: "Scraping failed internally. Please try again later." }); // More generic error for user
            }
        } else {
            res.status(200).json(details);
        }
    } catch (error) {
        console.error(`Server error processing query '${query}': ${error}`);
        res.status(500).json({ error: "Internal server error during scraping process." });
    }
});

// Removed the explicit app.get("/", ...) route as express.static should handle it.

// Start the server - Listen on 0.0.0.0 for external accessibility
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel (Vercel handles the listen call if deployed there)
module.exports = app;

