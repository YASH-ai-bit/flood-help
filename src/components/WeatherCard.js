import React from "react";
import "./WeatherCard.css";

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) {
    return (
      <div className="weather-loading">
        <div className="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }

  const cur = weatherData.current_weather;
  const temp = cur.temperature.toFixed(1);
  const wind = cur.windspeed;
  const condition = cur.weathercode < 3 ? "Clear" : "Rain likely";

  return (
    <div className="weather-grid">
      <div className="weather-item">
        <div className="weather-icon">🌡️</div>
        <div className="weather-info">
          <span className="weather-label">Temperature</span>
          <span className="weather-value">{temp}°C</span>
        </div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">💨</div>
        <div className="weather-info">
          <span className="weather-label">Wind Speed</span>
          <span className="weather-value">{wind} m/s</span>
        </div>
      </div>
      <div className="weather-item">
        <div className="weather-icon">
          {condition === "Clear" ? "☀️" : "🌧️"}
        </div>
        <div className="weather-info">
          <span className="weather-label">Condition</span>
          <span className="weather-value">{condition}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
