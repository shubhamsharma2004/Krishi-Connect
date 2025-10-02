import React from "react";
import "../styles/Services.css";

const services = [
  {
    title: "Farmer Corner",
    desc: "Apply for Crop Insurance Yourself",
    footer: "Farmer Corner",
    bg: "card aqua",
    icon: "📄",
  },
  {
    title: "Insurance Premium Calculator",
    desc: "Know your insurance premium before",
    footer: "Calculate",
    bg: "card green",
    icon: "🧮",
  },
  {
    title: "Application Status",
    desc: "Know your application status on every step",
    footer: "Application Status",
    bg: "card peach",
    icon: "📝",
  },
  {
    title: "Krishi Rakshak Portal & Helpline (KRPH)",
    desc: "Tell us about your Grievances & Report loss of Crop",
    footer: "Krishi Rakshak",
    bg: "card pink",
    icon: "📞",
  },
  {
    title: "Learning Management System",
    desc: "Your Gateway to Smarter Farming & Insurance Learning",
    footer: "PMFBY - LMS",
    bg: "card lime",
    icon: "📚",
    tag: "New Launch",
  },
  {
    title: "Weather Information Network & Data System",
    desc: "Know your Area's Weather Updates",
    footer: "Weather Data",
    bg: "card violet",
    icon: "☁️",
  },
];

export default function Services() {
  return (
    <section className="services-section">
      <h2 className="section-title">मुख्य सेवाएं</h2>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={i} className={s.bg}>
            {s.tag && <span className="tag">{s.tag}</span>}
            <div className="icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="footer">{s.footer}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
