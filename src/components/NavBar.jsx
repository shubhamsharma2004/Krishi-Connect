import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";


export default function NavBar(){
const { pathname } = useLocation();
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll);
return () => window.removeEventListener("scroll", onScroll);
}, []);


return (
<header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
<div className="nav__inner">
<Link className="nav__brand" to="/">
  <span className="nav__logo">KC</span>
  <span>KrishiConnect</span>
</Link>
<nav className="nav__links">
{[
{ to: "/", label: "Home" },
{ to: "/schemes", label: "New Schemes" },
{ to: "/jobs", label: "Jobs" },
{ to: "/help", label: "Help" },
].map((i) => (
<Link key={i.to} to={i.to} className={`nav__link ${pathname === i.to ? "is-active" : ""}`}>{i.label}</Link>
))}
</nav>
</div>
{/*<div className="nav__blur" aria-hidden />*/}
</header>
);
}