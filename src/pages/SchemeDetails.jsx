// src/pages/SchemeDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CACHE_KEY = "schemes_cache_v1";

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cache = loadCache();
  const item = cache?.items?.find(it => String(it.id) === String(id)) || null;

  return (
    <main style={{ maxWidth: 900, margin: "28px auto", padding: "0 18px" }}>
      <button className="btn" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>Back</button>

      {item ? (
        <article style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 10px 22px rgba(2,6,23,0.06)" }}>
          <h1 style={{ marginTop: 0 }}>{item.title}</h1>
          <div style={{ color: "#6b7280", marginBottom: 14 }}>{item.state}</div>
          <p style={{ color: "#374151" }}>{item.description}</p>

          {item.applyUrl ? (
            <p style={{ marginTop: 18 }}>
              <a className="btn btn--solid" href={item.applyUrl} target="_blank" rel="noopener noreferrer">Open Apply Link</a>
            </p>
          ) : (
            <p style={{ marginTop: 18, color: "#6b7280" }}>No external apply link available for this scheme.</p>
          )}

          <details style={{ marginTop: 18 }}>
            <summary>Raw record</summary>
            <pre style={{ whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>{JSON.stringify(item.__raw, null, 2)}</pre>
          </details>
        </article>
      ) : (
        <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
          <p>Scheme not found in cache.</p>
          <p>Go back to the list and click Refresh to fetch data again.</p>
        </div>
      )}
    </main>
  );
}
