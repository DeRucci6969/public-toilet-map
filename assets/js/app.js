/* global maptilerSdk, Papa */
// Configure the MapTiler SDK with your public API key.  If you fork this
// repository, replace the placeholder below with your own key.  See the
// README for details on obtaining a key.
maptilerSdk.config.apiKey = 'YOUR_MAPTILER_PUBLIC_KEY_HERE';

// Initialise the map.  Use a sensible default centre (the centre of
// Australia) so users see something if geolocation/search fails.  The
// container id must match the <main id="map"> element in index.html.
const map = new maptilerSdk.Map({
  container: 'map',
  style: maptilerSdk.MapStyle.STREETS,
  center: [133.7751, -25.2744],
  zoom: 4
});

/*
 * Geocoder search
 * Listen for input events on the search box.  Debounce behaviour is
 * implemented by aborting any outstanding fetch when a new keystroke
 * arrives.  When the user types something, call the MapTiler geocoding
 * API and pan/zoom the map to the best result.
 */
const searchInput = document.getElementById('search');
let controller;
searchInput.addEventListener('input', async e => {
  const q = e.target.value.trim();
  if (!q) return;
  // Abort previous request if still in flight
  controller?.abort();
  controller = new AbortController();
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${maptilerSdk.config.apiKey}`;
  try {
    const res = await fetch(url, { signal: controller.signal });
    const { features } = await res.json();
    if (features?.[0]) {
      const [lon, lat] = features[0].center;
      map.flyTo({ center: [lon, lat], zoom: 16 });
    }
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err);
  }
});

/*
 * Use‑My‑Location button
 * When clicked, attempt to obtain the user's current position via the
 * Geolocation API and smoothly animate the map to that point.  If
 * geolocation is unavailable or denied, provide a simple alert.
 */
document.getElementById('locateBtn').addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(pos => {
    const { longitude: lon, latitude: lat } = pos.coords;
    map.flyTo({ center: [lon, lat], zoom: 16 });
  }, () => alert('Unable to retrieve location'));
});

/*
 * Load public‑toilet data
 * Fetch the CSV file from the assets folder.  Use Papa Parse to
 * convert the CSV into JSON objects, then transform them into a
 * GeoJSON FeatureCollection.  When the map finishes loading its
 * style, add the GeoJSON as a data source and display simple circle
 * markers.  This function runs immediately so that markers appear
 * once the CSV file has been provided by the project owner.
 */
async function loadToilets () {
  try {
    const res = await fetch('/assets/data/toilets.csv');
    if (!res.ok) throw new Error('Failed to fetch toilets.csv');
    const csvText = await res.text();
    const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const geojson = {
      type: 'FeatureCollection',
      features: data.map(row => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [Number(row.lon), Number(row.lat)] },
        properties: row
      }))
    };
    map.on('load', () => {
      map.addSource('toilets', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'toilet-dots',
        type: 'circle',
        source: 'toilets',
        paint: { 'circle-radius': 5, 'circle-color': '#2563eb' }
      });
    });
  } catch (err) {
    console.warn('Toilet data failed to load:', err);
  }
}
loadToilets();
