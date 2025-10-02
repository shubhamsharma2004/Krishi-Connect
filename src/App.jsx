import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SchemeDetails from "./pages/SchemeDetails";


const Home = lazy(() => import("./pages/Home"));
const Schemes = lazy(() => import("./pages/Schemes"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Help = lazy(() => import("./pages/Help"));

export default function App() {
  return (
    <div className="app-root">
      <NavBar />
      <Suspense fallback={<div className="page-loader">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<div className="not-found">404 — Page not found</div>} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
