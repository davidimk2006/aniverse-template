    // api/proxy.js
    import fetch from 'node-fetch'; // Vercel's Node.js environment has fetch available

    export default async function (req, res) {
      // Allow CORS for development or specific origins
      res.setHeader('Access-Control-Allow-Origin', '*'); // Consider restricting this in production
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        return res.status(200).send('OK');
      }

      const { path, limit, fields } = req.query;

      if (!path) {
        return res.status(400).send('Missing "path" query parameter');
      }

      try {
        // Construct the URL for the external API you are proxying to
        // Replace 'YOUR_EXTERNAL_API_BASE_URL' with the actual base URL
        // And 'YOUR_API_KEY' with your actual API key, ideally from environment variables
        const externalApiBase = process.env.EXTERNAL_API_BASE_URL || 'https://api.myanimelist.net/v2/';
        const apiKey = process.env.MAL_CLIENT_ID; // Example for MyAnimeList

        if (!apiKey && externalApiBase.includes('myanimelist.net')) {
          console.error("MAL_CLIENT_ID environment variable is not set.");
          return res.status(500).send("Server configuration error: API Key missing.");
        }

        let targetUrl = `${externalApiBase}${path}`;
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit);
        if (fields) queryParams.append('fields', fields);

        const queryString = queryParams.toString();
        if (queryString) {
          targetUrl += `?${queryString}`;
        }

        const headers = {};
        if (externalApiBase.includes('myanimelist.net')) {
          headers['X-MAL-CLIENT-ID'] = apiKey;
        }

        const response = await fetch(targetUrl, { headers });

        if (!response.ok) {
          console.error(`External API error: ${response.status} ${response.statusText}`, await response.text());
          return res.status(response.status).send(response.statusText);
        }

        const data = await response.json();
        res.status(200).json(data);

      } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Internal Server Error');
      }
    }
    
