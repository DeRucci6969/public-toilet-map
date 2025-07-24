# Public Toilet Finder

This repository hosts **Public Toilet Finder**, a mobile‑first web application that helps you locate public toilets across Australia.  The goal of this first release (v0.1) is to ship a minimal, fully static landing page served via GitHub Pages that shows an interactive map, allows address search, and can pan to your current location.

## Features and Roadmap

* **Interactive map** – Built with the MapTiler SDK JS v3, the map displays the entire Australian continent by default and supports smooth panning and zooming.
* **Search box** – Powered by MapTiler’s geocoding API.  Type an address or place name to fly the map to that location.
* **Use My Location** – Utilises the browser’s Geolocation API to centre the map on your current position.
* **Planned improvements** – Future versions will include SEO‑friendly location pages, the ability to monetise via AdSense, advanced filtering (accessible toilets, open hours), and performance optimisations.

## Setup and Configuration

1. **Obtain a MapTiler API key.**  Sign up at [maptiler.com](https://www.maptiler.com/cloud/) and create a free account.  Replace the placeholder string `YOUR_MAPTILER_PUBLIC_KEY_HERE` in both **index.html** and **assets/js/app.js** with your own public key.  Do **not** commit secret keys.
2. **Upload toilet data.**  To display toilet locations, add a CSV file at `/assets/data/toilets.csv` with headers `name,lat,lon` (other columns are allowed and become feature properties).  You can upload or replace this file directly in the GitHub UI (Add file → Upload files), then commit the change.
3. **Preview locally.**  Because this project is purely static, you can test it using any local web server.  One simple option is Python’s built‑in server:

   ```bash
   # from the repository root
   python3 -m http.server 8000

   # then navigate to http://localhost:8000 in your browser
   ```

   Alternatively, install [serve](https://www.npmjs.com/package/serve) with `npm install -g serve` and run `serve .`.

4. **Enable GitHub Pages.**  After pushing to the `main` branch, go to your repository’s **Settings → Pages**.  Under “Deploy from a branch,” select **main** as the branch and “/** (root)**” as the folder.  Save your settings and your site will be available at `https://<username>.github.io/public-toilet-map/`.

## Project Structure

```
/                  # repository root
├─ index.html      # single‑page application
├─ .nojekyll       # disables Jekyll processing on GitHub Pages
├─ README.md       # this document
└─ assets/
   ├─ js/
   │  └─ app.js    # initialises the map and controls
   └─ data/
      └─ toilets.csv  # CSV placeholder (lat, lon, name)
```

## Contributions

Feedback and pull requests are welcome.  The initial release focuses on establishing the core map and UI.  Future improvements (SEO, analytics, advanced filters) will be tracked via GitHub issues and milestones.
