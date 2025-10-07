import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FloodPredictionPage.css";

function FloodPredictionPage() {
  const [activeLayers, setActiveLayers] = useState({});
  const [map, setMap] = useState(null);
  const navigate = useNavigate();
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
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h1>Flood Prediction Model</h1>
      </header>

      <div className="controls">
        <button className="btn" onClick={() => toggleLayer("srtm")}>
          Elevation Layer
        </button>
        <button className="btn" onClick={() => toggleLayer("slope")}>
          Slope Analysis
        </button>
        <button className="btn" onClick={() => toggleLayer("occurrence")}>
          Flood History
        </button>
        <button className="btn" onClick={() => toggleLayer("inundation")}>
          Inundation Risk
        </button>
        <button className="btn" onClick={downloadRainfall}>
          Export Rainfall Data
        </button>
      </div>

      <div id="map"></div>
    </div>
  );
}

export default FloodPredictionPage;
