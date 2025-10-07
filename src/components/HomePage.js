import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import "leaflet/dist/leaflet.css";
import "./HomePage.css";
import WeatherCard from "./WeatherCard";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function HomePage() {
  const [weatherData, setWeatherData] = useState(null);
  const [reportMsg, setReportMsg] = useState("");
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // GSAP Animations
    const ctx = gsap.context(() => {
      // Header entrance animation
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: -100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Hero section animations with typewriter effect
      const heroTitle = document.querySelector(".hero-title");
      const heroSub = document.querySelector(".hero-sub");

      if (heroTitle && heroSub) {
        const heroTl = gsap.timeline({ delay: 0.3 });

        // Typewriter effect for hero title
        heroTl
          .set(heroTitle, { opacity: 1 })
          .to(heroTitle, {
            text: "POWERED BY GEO SOLUTIONS",
            duration: 2,
            ease: "none",
          })
          .from(
            heroSub,
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.3"
          );
      }

      // Floating animation for hero background
      const heroBefore = document.querySelector(".hero");
      if (heroBefore) {
        gsap.to(heroBefore, {
          backgroundPosition: "50% 60%",
          duration: 8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // Simple scroll animation - just fade in sections
      const validSections = sectionsRef.current.filter(
        (section) => section !== null
      );

      validSections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
      });
    });

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
      ctx.revert(); // Cleanup GSAP animations
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Kill all ScrollTriggers
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

      // GSAP Animate weather card only
      setTimeout(() => {
        const weatherCard = document.getElementById("weatherCard");
        if (weatherCard) {
          gsap.from(weatherCard, {
            scale: 0.95,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.5)",
          });
        }
      }, 100);
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

    // Animate success message
    setTimeout(() => {
      const msg = document.getElementById("reportMsg");
      if (msg) {
        gsap.from(msg, {
          scale: 0.8,
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "back.out(2)",
        });
      }
    }, 50);

    ev.target.reset();
    setTimeout(() => {
      gsap.to("#reportMsg", {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => setReportMsg(""),
      });
    }, 5000);
  };

  const renderWeather = () => {
    return <WeatherCard weatherData={weatherData} />;
  };

  return (
    <div className="home-page">
      <header ref={headerRef}>
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

      <div className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-title"></div>
          <div className="hero-sub">
            Guidance, inundation map & reporting for local residents
          </div>
        </div>
      </div>

      <section id="alerts" ref={(el) => (sectionsRef.current[0] = el)}>
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

      <section id="whatdo" ref={(el) => (sectionsRef.current[1] = el)}>
        <h2>Safety Guidelines</h2>
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

      <section id="helplines" ref={(el) => (sectionsRef.current[2] = el)}>
        <h2>Emergency Contacts</h2>
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

      <section id="mapSection" ref={(el) => (sectionsRef.current[3] = el)}>
        <h2>Interactive Flood Map</h2>
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
            <span>Advanced Prediction Model</span>
          </Link>
        </div>
      </section>

      <section id="report" ref={(el) => (sectionsRef.current[4] = el)}>
        <h2>Report Incident</h2>
        <div className="card">
          <form onSubmit={sendReport}>
            <label>
              Name:
              <input
                type="text"
                id="rname"
                name="rname"
                placeholder="Your full name"
              />
            </label>
            <label>
              Phone:
              <input
                type="tel"
                id="rphone"
                name="rphone"
                placeholder="Your contact number"
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                id="rloc"
                name="rloc"
                placeholder="Incident location"
              />
            </label>
            <label>
              Details:
              <textarea
                id="rdetails"
                name="rdetails"
                placeholder="Describe the situation..."
              ></textarea>
            </label>
            <button className="btn" type="submit">
              <span>Submit Report</span>
            </button>
          </form>
          {reportMsg && <p id="reportMsg">{reportMsg}</p>}
        </div>
      </section>

      <section id="about" ref={(el) => (sectionsRef.current[5] = el)}>
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
