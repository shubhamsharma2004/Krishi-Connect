import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function NavBar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link className="nav__brand" to="/">
          <span className="nav__logo">🌾</span>
          <span>KrishiConnect</span>
        </Link>

        {/* Desktop links */}
        <nav className={`nav__links ${menuOpen ? "is-open" : ""}`}>
          {[
            { to: "/", label: "Home" },
            { to: "/schemes", label: "New Schemes" },
            { to: "/jobs", label: "Jobs" },
            { to: "/help", label: "Help" },
          ].map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className={`nav__link ${pathname === i.to ? "is-active" : ""}`}
              onClick={() => setMenuOpen(false)} // close after click
            >
              {i.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button */}
        <button
          className="nav__toggle"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>
    </header>
  );
}
