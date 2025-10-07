import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./HomePage.css";

function HomePage() {
  const [weatherData, setWeatherData] = useState(null);
  const [reportMsg, setReportMsg] = useState("");

  useEffect(() => {
    // Initialize map
    const map = L.map("map").setView([28.9845, 79.4141], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    L.marker([28.9845, 79.4141])
      .addTo(map)
      .bindPopup("<b>Udham Singh Nagar</b><br>Demo flood marker.")
      .openPopup();

    // Fetch weather
    fetchWeather();

    // Navigation scroll highlight
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll("nav a");
      let current = "";

      sections.forEach((sec) => {
        const secTop = sec.offsetTop - 120;
        if (window.scrollY >= secTop) {
          current = sec.getAttribute("id");
        }
      });

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2
      ) {
        current = "about";
      }

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      map.remove();
    };
  }, []);

  const fetchWeather = async () => {
    const lat = 28.9845,
      lon = 79.4141;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability,temperature_2m`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      setWeatherData(data);

      // Animate weather card
      const weatherCard = document.getElementById("weatherCard");
      if (weatherCard) {
        weatherCard.classList.remove("pop-yellow");
        void weatherCard.offsetWidth;
        weatherCard.classList.add("pop-yellow");
      }

      // Animate flood prediction button card (blue)
      const floodCard = document.getElementById("floodPredictionCard");
      if (floodCard) {
        floodCard.classList.remove("pop-blue");
        void floodCard.offsetWidth;
        floodCard.classList.add("pop-blue");
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  const sendReport = (ev) => {
    ev.preventDefault();
    const name = ev.target.rname.value || "Resident";
    const loc = ev.target.rloc.value || "(unspecified)";
    setReportMsg(
      `✅ Thank you ${name}! Your report for ${loc} has been submitted.`
    );
    ev.target.reset();
  };

  const renderWeather = () => {
    if (!weatherData) {
      return (
        <p>
          <b>Loading weather...</b>
        </p>
      );
    }

    const cur = weatherData.current_weather;
    const temp = cur.temperature.toFixed(1);
    const wind = cur.windspeed;

    return (
      <>
        <p>
          <b>Temperature:</b> {temp} °C
        </p>
        <p>
          <b>Wind speed:</b> {wind} m/s
        </p>
        <p>
          <b>Condition:</b> {cur.weathercode < 3 ? "Clear" : "Rain likely"}
        </p>
      </>
    );
  };

  return (
    <div className="home-page">
      <header>
        <h1>Flood Help – Udham Singh Nagar</h1>
        <nav>
          <a href="#alerts">Alerts</a>
          <a href="#whatdo">What To Do</a>
          <a href="#helplines">Helplines</a>
          <a href="#mapSection">Flood Map</a>
          <a href="#report">Report</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-title">POWERED BY GEO SOLUTIONS</div>
          <div className="hero-sub">
            Guidance, inundation map & reporting for local residents
          </div>
        </div>
      </div>

      <section id="alerts">
        <h2>Current Alerts & Weather</h2>
        <div className="card" id="weatherCard">
          <div id="weatherContainer" className="weather-box">
            {renderWeather()}
          </div>
          <p>
            <i>
              Rain forecast data is from Open-Meteo API (Udham Singh Nagar
              region).
            </i>
          </p>
        </div>
      </section>

      <section id="whatdo">
        <h2>🚪 What To Do</h2>
        <div className="card">
          <h3>Before Flood</h3>
          <ul>
            <li>Keep food, water, and medicines ready</li>
            <li>Store documents in waterproof bag</li>
            <li>Clean nearby drainage channels</li>
          </ul>
        </div>
        <div className="card">
          <h3>During Flood</h3>
          <ul>
            <li>Move to higher ground immediately</li>
            <li>Turn off main electricity</li>
            <li>Do not walk or drive in floodwaters</li>
          </ul>
        </div>
      </section>

      <section id="helplines">
        <h2>📞 Important Helplines</h2>
        <div className="card">
          <p>
            <b>District Disaster Management Authority:</b> 05944-250719
          </p>
          <p>
            <b>Emergency Health:</b> 108
          </p>
          <p>
            <b>Police / Rescue:</b> 112
          </p>
        </div>
      </section>

      <section id="mapSection">
        <h2>🗺 Flood Inundation Mapping</h2>
        <div className="card">
          <p>
            This map shows the <b>current estimated flood-prone areas</b> in
            Udham Singh Nagar.
          </p>
          <div id="map"></div>
        </div>

        <div
          className="card"
          id="floodPredictionCard"
          style={{ textAlign: "center" }}
        >
          <Link to="/flood_prediction" className="btn">
            Flood Prediction Model
          </Link>
        </div>
      </section>

      <section id="report">
        <h2>📝 Report Flood</h2>
        <div className="card">
          <form onSubmit={sendReport}>
            <label>
              Name:
              <input type="text" id="rname" name="rname" />
            </label>
            <label>
              Phone:
              <input type="text" id="rphone" name="rphone" />
            </label>
            <label>
              Location:
              <input type="text" id="rloc" name="rloc" />
            </label>
            <label>
              Details:
              <textarea id="rdetails" name="rdetails"></textarea>
            </label>
            <button className="btn" type="submit">
              Submit Report
            </button>
          </form>
          <p id="reportMsg">{reportMsg}</p>
        </div>
      </section>

      <section id="about">
        <h2>About This Site</h2>
        <div className="card">
          <p>
            This site helps residents of Udham Singh Nagar by providing{" "}
            <b>real-time flood alerts, live weather updates</b>, and{" "}
            <b>inundation maps</b> powered by Geo Solutions.
          </p>
          <p>
            Our mission is to increase awareness and help coordinate emergency
            actions during heavy rainfall or flood events.
          </p>
        </div>
      </section>

      <footer>
        © 2025 Udham Singh Nagar Flood Help • Built for community safety
      </footer>
    </div>
  );
}

export default HomePage;
