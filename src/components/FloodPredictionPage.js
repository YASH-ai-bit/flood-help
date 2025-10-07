import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FloodPredictionPage.css";

function FloodPredictionPage() {
  const [activeLayers, setActiveLayers] = useState({});
  const [map, setMap] = useState(null);
  const BACKEND_URL = ""; // e.g. 'https://your-server.com' or '' if same origin

  useEffect(() => {
    // Initialize map
    const mapInstance = L.map("map").setView([28.9845, 79.4141], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const getLayerTileUrl = async (name) => {
    const resp = await fetch(`${BACKEND_URL}/layer/${name}`);
    if (!resp.ok) throw new Error("Failed to get layer: " + resp.statusText);
    const json = await resp.json();
    return json.tileUrl;
  };

  const toggleLayer = async (name) => {
    if (!map) return;

    try {
      // If already active, remove
      if (activeLayers[name]) {
        map.removeLayer(activeLayers[name]);
        const newLayers = { ...activeLayers };
        delete newLayers[name];
        setActiveLayers(newLayers);
        return;
      }

      // Otherwise, fetch tile template and add
      const urlTemplate = await getLayerTileUrl(name);
      const layer = L.tileLayer(urlTemplate, {
        opacity: 0.6,
        attribution: "GEE layers",
      });
      layer.addTo(map);

      setActiveLayers({ ...activeLayers, [name]: layer });
    } catch (err) {
      console.error(err);
      alert("Could not load layer: " + err.message);
    }
  };

  const downloadRainfall = () => {
    const start = prompt("Start date (YYYY-MM-DD)", "2023-06-01");
    const end = prompt(
      "End date (YYYY-MM-DD)",
      new Date().toISOString().slice(0, 10)
    );
    if (!start || !end) return;
    const url = `${BACKEND_URL}/export_rainfall_csv?start_date=${start}&end_date=${end}`;
    // Force download
    window.location.href = url;
  };

  return (
    <div className="flood-prediction-page">
      <header>
        <h1>Flood Help – Udham Singh Nagar</h1>
      </header>

      <div className="controls">
        <button className="btn" onClick={() => toggleLayer("srtm")}>
          Toggle Elevation
        </button>
        <button className="btn" onClick={() => toggleLayer("slope")}>
          Toggle Slope
        </button>
        <button className="btn" onClick={() => toggleLayer("occurrence")}>
          Toggle Flood Occurrence
        </button>
        <button className="btn" onClick={() => toggleLayer("inundation")}>
          Toggle Potential Inundation
        </button>
        <button className="btn" onClick={downloadRainfall}>
          Download Rainfall CSV
        </button>
      </div>

      <div id="map"></div>
    </div>
  );
}

export default FloodPredictionPage;
