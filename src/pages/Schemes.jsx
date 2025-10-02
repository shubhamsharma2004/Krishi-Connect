// src/pages/Schemes.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/schemes.css";

const PAGE_SIZE = 10;
const CACHE_KEY = "schemes_cache_v1";
const SAMPLE_DATA = [
  { id: "pmkisan", title: "PM-Kisan Samman Nidhi", state: "Central", description: "Direct income support to farmer families", applyUrl: "https://pmkisan.gov.in" },
  { id: "crop-ins", title: "Crop Insurance (Demo)", state: "State", description: "Crop insurance scheme example", applyUrl: "#" },
  { id: "soil-health", title: "Soil Health Card", state: "Central", description: "Soil testing & advisory", applyUrl: "#" },
];

function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
function safeString(v) { if (v === null || v === undefined) return ""; return String(v); }
function formatAmount(v) {
  if (v === null || v === undefined) return "NA";
  if (v === "NA") return "NA";
  const n = Number(v);
  if (!isFinite(n)) return String(v);
  return n % 1 === 0 ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function Schemes() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [lastError, setLastError] = useState(null);

  const debouncedQuery = useDebounced(query, 350);
  const outerAbortRef = useRef(null);
  const fetchSeq = useRef(0);

  const pageCount = useMemo(() => {
    const total = typeof totalItems === "number" ? totalItems : items.length;
    return Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));
  }, [items, totalItems]);

  const loadCache = () => {
    try { const raw = localStorage.getItem(CACHE_KEY); if (!raw) return null; return JSON.parse(raw); } catch { return null; }
  };
  const saveCache = (arr, total) => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items: arr, total })); } catch {}
  };

  // normalizeRecords: adapts API shape to internal { id, title, description, state, applyUrl, detailsUrl }
  const normalizeRecords = (data) => {
    const records = Array.isArray(data.schemes) ? data.schemes
      : Array.isArray(data.records) ? data.records
      : Array.isArray(data.data) ? data.data
      : [];
    if (!Array.isArray(records) || records.length === 0) return null;

    const mapped = records.map((r, idx) => {
      // map keys from your JSON:
      const title = safeString(r.schemeName || r.scheme || r.title || r.name || "");
      const mission = safeString(r.ministry || r.mission || r.sector || "");
      // Build description: prefer explicit description, else combine eligibility & benefits & amounts if present
      const amounts = [
        r.actual___2022_23 ?? r["actual_2022_23"] ?? r.actual2022 ?? null,
        r.actual___2023_24 ?? r["actual_2023_24"] ?? r.actual2023 ?? null,
        r.actual___2024_25 ?? r["actual_2024_25"] ?? r.actual2024 ?? null,
      ].filter(v => v != null).map((v,i) => `Year${i+1}: ${formatAmount(v)}`); // fallback simple labels
      const descFromAmounts = amounts.length ? amounts.join(" • ") : "";
      const description = r.description
        ? String(r.description)
        : [r.eligibility, r.benefits, mission, descFromAmounts].filter(Boolean).join(" • ") || "No description available.";

      const possibleApply = (r.applyUrl || r.apply_url || r.website || r.url || r.link || r.apply_link || "").toString().trim();
      const applyUrl = (possibleApply && possibleApply !== "#" ? possibleApply : "");

      const stableId = r.schemeId ?? r.id ?? r._id ?? idx;
      const detailsUrl = `/schemes/${encodeURIComponent(String(stableId))}`;

      return {
        id: stableId,
        title: title || "Untitled scheme",
        description,
        state: r.ministry ?? r.sector ?? r.state ?? r.org_type ?? "—",
        applyUrl,
        detailsUrl,
        postedOn: r.launchYear ?? r.postedOn ?? "",
        __raw: r,
      };
    });

    return { list: mapped, total: typeof data.total === "number" ? data.total : mapped.length };
  };

  const fetchWithRetry = async (url, outerSignal = null, attempts = 2, baseDelay = 400) => {
    let lastErr = null;
    for (let i = 0; i < attempts; i++) {
      const perAttempt = new AbortController();
      let outerListener = null;
      if (outerSignal) {
        if (outerSignal.aborted) perAttempt.abort();
        else {
          outerListener = () => perAttempt.abort();
          outerSignal.addEventListener("abort", outerListener);
        }
      }
      try {
        const res = await fetch(url, { signal: perAttempt.signal, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        if (outerListener && outerSignal) outerSignal.removeEventListener("abort", outerListener);
        return await res.json();
      } catch (e) {
        if (outerListener && outerSignal) outerSignal.removeEventListener("abort", outerListener);
        if (e && (e.name === "AbortError" || /aborted|cancelled|canceled/i.test(String(e.message || "")))) throw e;
        lastErr = e;
        console.warn(`[Schemes] fetch attempt ${i+1} failed:`, e);
        if (i < attempts - 1) await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, i)));
      }
    }
    throw lastErr;
  };

  const doFetch = async ({ showBanner = true } = {}) => {
    const seq = ++fetchSeq.current;
    setLoading(true);
    setBanner("");
    setLastError(null);

    const API_URL = import.meta.env.VITE_SCHEMES_API || "/dummy-schemes.json"; // <-- change to your real URL or keep /dummy-schemes.json in public/
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("pageSize", PAGE_SIZE);
    if (debouncedQuery) params.set("q", debouncedQuery);
    const url = `${API_URL}${API_URL.includes("?") ? "&" : "?"}${params.toString()}`;

    const cached = loadCache();
    if (cached && Array.isArray(cached.items) && cached.items.length > 0) {
      setItems(cached.items);
      setTotalItems(typeof cached.total === "number" ? cached.total : cached.items.length);
    }

    try {
      if (!outerAbortRef.current) outerAbortRef.current = new AbortController();
      const json = await fetchWithRetry(url, outerAbortRef.current.signal, 2);
      if (seq !== fetchSeq.current) return;
      const parsed = normalizeRecords(json);
      if (parsed && Array.isArray(parsed.list)) {
        setItems(parsed.list);
        setTotalItems(parsed.total ?? parsed.list.length);
        saveCache(parsed.list, parsed.total);
        setLoading(false);
        return;
      } else {
        if (showBanner) setBanner("API returned no records; showing sample data.");
        setItems(SAMPLE_DATA);
        setTotalItems(SAMPLE_DATA.length);
        setLoading(false);
        return;
      }
    } catch (e) {
      if (e && (e.name === "AbortError" || /aborted|cancelled|canceled/i.test(String(e.message || "")))) {
        return;
      }
      console.error("[Schemes] fetch failed:", e);
      setLastError(e);
      if (showBanner) {
        const msg = String(e?.message || "");
        if (/cors|access-control/i.test(msg)) setBanner("CORS or blocked by browser — consider using a dev proxy.");
        else if (/429|rate limit/i.test(msg)) setBanner("Rate-limited by API — try again later.");
        else setBanner("Network/API error. Showing cached/sample data.");
      }
      const cached2 = loadCache();
      if (cached2 && Array.isArray(cached2.items) && cached2.items.length > 0) {
        setItems(cached2.items);
        setTotalItems(cached2.total ?? cached2.items.length);
      } else {
        setItems(SAMPLE_DATA);
        setTotalItems(SAMPLE_DATA.length);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    doFetch().catch(e => {
      if (e && (e.name === "AbortError" || /aborted|cancelled|canceled/i.test(String(e.message || "")))) return;
      console.error("[Schemes] unexpected doFetch error:", e);
    });
    return () => { try { outerAbortRef.current?.abort(); } catch (err) {} outerAbortRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page]);

  const visible = useMemo(() => {
    const q = (debouncedQuery || "").trim().toLowerCase();
    const base = Array.isArray(items) ? items : [];
    const filtered = q ? base.filter(it => ((it.title || "") + " " + (it.description || "") + " " + (it.state || "")).toLowerCase().includes(q)) : base;
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [items, debouncedQuery, page]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && page < pageCount) setPage(p => p + 1);
      if (e.key === "ArrowLeft" && page > 1) setPage(p => p - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, pageCount]);

  return (
    <main className="schemes-page job-like-page">
      <header className="schemes-header">
        <div className="schemes-header__inner">
          <h1>🌱 New Scheme</h1>
          <p className="sub">Find central & state programs with direct apply links.</p>
          <button className="btn btn--ghost" onClick={() => doFetch({ showBanner: true })}>Refresh</button>
        </div>
      </header>

      <div className="schemes-controls">
        <div className="left">
          <label className="search">
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search schemes, keywords, state..." aria-label="Search schemes" />
          </label>
        </div>

        <div className="right">
          <div className="small">{loading ? "Loading..." : `${typeof totalItems === "number" ? totalItems : items.length} results`}</div>
        </div>
      </div>

      {banner && (
        <div className="alert banner" role="status">
          {banner}
          {lastError && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: "pointer" }}>Debug: show error</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{String(lastError && lastError.stack ? lastError.stack : JSON.stringify(lastError, null, 2))}</pre>
            </details>
          )}
        </div>
      )}

      <section className="schemes-grid job-grid" aria-live="polite">
        {visible.length === 0 && !loading ? <div className="empty">No schemes match your filters.</div> : visible.map((s) => (
          <article className="card scheme-card" key={s.id}>
            <div className="card-top">
              <button className="mini-dot" aria-hidden>—</button>
              <h2 className="card-title">{s.title}</h2>
            </div>

            <div className="card-meta">
              <div className="company">{s.state || "—"}</div>
              {s.description && <div className="meta-line">{s.description}</div>}
            </div>

            <div className="card-actions" style={{ gap: 12, alignItems: "center" }}>
              {s.applyUrl ? (
                <a className="apply-btn" href={s.applyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Apply</a>
              ) : (
                <button type="button" className="apply-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(s.detailsUrl); }} title="Open details">Apply</button>
              )}

              <Link className="details-btn" to={s.detailsUrl} onClick={(e) => e.stopPropagation()}>Details</Link>
            </div>

            {s.postedOn && <div className="posted">📅 Launched: {s.postedOn}</div>}
          </article>
        ))}
      </section>

      <div className="schemes-pagination pagination">
        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <div className="page-info">Page {page} / {pageCount}</div>
        <button className="page-btn" disabled={page >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>Next</button>
      </div>

      <footer className="schemes-footer">
        <small>Showing cached/sample data when API is unavailable. For production set <code>VITE_SCHEMES_API</code> in .env</small>
        <div className="footer-line">© 2025 KrishiConnect — All rights reserved</div>
      </footer>
    </main>
  );
}
