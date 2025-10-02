// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  /* -------------------- Animated counters -------------------- */
  const [stats, setStats] = useState({ schemes: 0, jobs: 0, farmers: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setStats((p) => ({
        schemes: Math.min(500, p.schemes + 10),
        jobs: Math.min(1000, p.jobs + 20),
        farmers: Math.min(50000, p.farmers + 1200),
      }));
    }, 45);
    return () => clearInterval(t);
  }, []);

  /* -------------------- Reveal on scroll --------------------- */
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("reveal--on");
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* -------------------- Modal / Weather ---------------------- */
  const [modal, setModal] = useState({ open: false, title: "", type: "" });
  const [weather, setWeather] = useState(null); // { temp, condition, humidity, city } | {error} | null

  // Accepts lat/lon; if not provided, falls back to Delhi
  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_KEY;
      if (!API_KEY) throw new Error("Missing API key");

      let url = "";
      if (lat != null && lon != null) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=hi`;
      } else {
        // Fallback Delhi
        url = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${API_KEY}&units=metric&lang=hi`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message || "API error");

      setWeather({
        temp: Math.round(data.main.temp),
        condition: data.weather?.[0]?.description || "—",
        humidity: data.main.humidity,
        city: data.name,
      });
    } catch (e) {
      setWeather({ error: "Weather info not available" });
    }
  };

  const openModal = (title, type = "normal") => {
    setModal({ open: true, title, type });
    if (type === "weather") {
      setWeather(null); // reset state
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            fetchWeather(latitude, longitude);
          },
          () => fetchWeather(), // fallback (Delhi)
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
      } else {
        fetchWeather(); // fallback (Delhi)
      }
    }
  };

  const closeModal = () => {
    setModal({ open: false, title: "", type: "" });
    setWeather(null);
  };

  /* -------------------- Services data (ordered) -------------------- */
  const items = [
    {
      id: "weather",
      title: "Weather Info",
      desc: "Get the latest weather updates for your region",
      footer: "Check Weather",
      icon: "🌦️",
      color: "peach",
      type: "weather",
    },
    {
      id: "calc",
      title: "Insurance Premium Calculator",
      desc: "Know your insurance premium before",
      footer: "Calculate",
      icon: "🧮",
      color: "green",
    },
    {
      id: "farmer",
      title: "Farmer Corner",
      desc: "Apply for Crop Insurance Yourself",
      footer: "Farmer Corner",
      icon: "📄",
      color: "aqua",
    },
  ];

  /* -------------------- Carousel helpers -------------------- */
  const railRef = useRef(null);
  const step = () =>
    (railRef.current?.querySelector(".service-card")?.clientWidth || 300) + 28;
  const scrollBy = (dir) =>
    railRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  /* ======================== UI =============================== */
  return (
    <main className="landing">
      {/* =============== HERO ================= */}
      <section className="hero">
        <div className="hero__overlay">
          <div className="hero__badge">किसान-हित प्लेटफ़ॉर्म</div>

          <h1 className="hero__title">
            सरकारी योजनाएं और <br />
            <span>नौकरी के अवसर — एक ही जगह</span>
          </h1>

          <p className="hero__subtitle">
            राज्य और केंद्र की 500+ योजनाएं, 1000+ जॉब्स, पात्रता, ज़रूरी दस्तावेज़
            और डायरेक्ट apply लिंक — सब कुछ आसान हिंदी में।
          </p>
          <p className="hero__trust">विश्वसनीय स्रोत • फ्री अपडेट्स • बिना लॉगिन पढ़ें</p>

          <div className="hero__actions">
            <Link to="/schemes" className="btn btn--solid" aria-label="Explore schemes">
              योजनाएं देखें →
            </Link>
            <Link to="/jobs" className="btn btn--outlineDark" aria-label="Find jobs">
              नौकरी खोजें
            </Link>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat__num">{stats.schemes}+</div>
            <div className="stat__label">सरकारी योजनाएं</div>
          </div>
          <div className="stat">
            <div className="stat__num">{stats.jobs}+</div>
            <div className="stat__label">नौकरी के अवसर</div>
          </div>
          <div className="stat">
            <div className="stat__num">{stats.farmers.toLocaleString()}+</div>
            <div className="stat__label">लाभार्थी किसान</div>
          </div>
        </div>
      </section>

      {/* =============== SERVICES ================= */}
      <section className="services" data-reveal>
        <h2 className="section-title">मुख्य सेवाएं</h2>
        <p className="section-sub">सबसे उपयोगी टूल्स जो आपको तुरंत आगे बढ़ाते हैं</p>

        <div className="carousel">
          <div className="carousel__fade carousel__fade--left" aria-hidden />
          <div className="carousel__fade carousel__fade--right" aria-hidden />

          <button
            className="carousel__arrow carousel__arrow--left"
            onClick={() => scrollBy(-1)}
            aria-label="scroll left"
          >
            ‹
          </button>

          <div className="carousel__rail" ref={railRef}>
            {items.map((s) => (
              <article
                key={s.id}
                className={`service-card service-card--${s.color}`}
                role="button"
                tabIndex={0}
                onClick={() => openModal(s.title, s.type)}
                onKeyDown={(e) => e.key === "Enter" && openModal(s.title, s.type)}
              >
                <div className="service-card__icon">{s.icon}</div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <div className="service-card__footer">{s.footer}</div>
              </article>
            ))}
          </div>

          <button
            className="carousel__arrow carousel__arrow--right"
            onClick={() => scrollBy(1)}
            aria-label="scroll right"
          >
            ›
          </button>
        </div>
      </section>

      {/* =============== MODAL ================= */}
      {modal.open && (
        <div className="modal" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal__card" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={closeModal} aria-label="Close">
              ×
            </button>

            {modal.type === "weather" ? (
              <>
                <div className="modal__icon">🌦️</div>
                <h3 className="modal__title">Weather Info</h3>

                {weather ? (
                  weather.error ? (
                    <p className="modal__desc">{weather.error}</p>
                  ) : (
                    <div className="weather-card">
                      <div className="weather-card__city">📍 {weather.city}</div>
                      <div className="weather-card__temp">{weather.temp}°C</div>
                      <div className="weather-card__condition">☁️ {weather.condition}</div>
                      <div className="weather-card__extra">
                        💧 Humidity: <strong>{weather.humidity}%</strong>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="modal__desc">Loading weather...</p>
                )}
              </>
            ) : (
              <>
                <div className="modal__icon">🚧</div>
                <h3 className="modal__title">Feature coming soon</h3>
                <p className="modal__desc">
                  <strong>{modal.title}</strong> अभी विकास में है। जल्द ही इसे लॉन्च किया जाएगा।
                </p>
              </>
            )}

            <button className="btn btn--solid" onClick={closeModal}>
              ठीक है
            </button>
          </div>
        </div>
      )}

      {/* =============== FEATURES ================= */}
      <section className="features" data-reveal>
        <h2 className="section-title">क्यों चुनें हमारा पोर्टल?</h2>
        <div className="features__grid">
          <div className="feature-tile">✅ आसान पहुंच</div>
          <div className="feature-tile">📋 नवीनतम जॉब्स</div>
          <div className="feature-tile">⏰ 24/7 सपोर्ट</div>
          <div className="feature-tile">⚡ तेज़ प्रक्रिया</div>
        </div>
      </section>

      {/* =============== CTA ================= */}
      {/* =============== CTA ================= */}
<section className="cta cta--glass" data-reveal>
  <div className="cta__wrap">
    <h3 className="cta__title">आज ही अपने अगले कदम तय करें</h3>

    <p className="cta__lead">
      अपनी <strong>eligibility</strong> समझें, सही दस्तावेज़ तैयार रखें और समय पर आवेदन करें — 
      हम देते हैं verified जानकारी और direct links।
    </p>

    <ul className="cta__benefits">
      <li>✅ रियल-टाइम अपडेट्स और नोटिफिकेशन</li>
      <li>✅ स्टेट-वाइज़ / श्रेणी-वाइज़ फ़िल्टर</li>
      <li>✅ आधिकारिक पोर्टल के सुरक्षित डायरेक्ट लिंक</li>
    </ul>

    <div className="cta__actions">
      {/* NOTE: use Links to your routes */}
      <Link to="/schemes" className="btn cta-btn cta-btn--primary btn--lg" aria-label="Explore Schemes">
        <span className="btn__icon" aria-hidden>📑</span>
        <span>Explore Schemes →</span>
      </Link>

      <Link to="/jobs" className="btn cta-btn cta-btn--outline btn--lg" aria-label="Find Jobs">
        <span className="btn__icon" aria-hidden>💼</span>
        <span>Find Jobs</span>
      </Link>
    </div>
  </div>
</section>

    </main>
  );
}
