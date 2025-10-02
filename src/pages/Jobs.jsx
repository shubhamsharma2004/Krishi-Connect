// Jobs.jsx
import React, { useEffect, useState } from "react";
import "./Jobs.css";

const PAGE_SIZE = 10;

const JobOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://dummyjson.com/c/9b1a-cb64-428c-af6a");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // support multiple possible keys just in case
        const arr =
          Array.isArray(data.Joblisting) ? data.Joblisting :
          Array.isArray(data.jobListings) ? data.jobListings :
          Array.isArray(data.joblisting) ? data.joblisting :
          Array.isArray(data.jobs) ? data.jobs :
          [];

        const formatted = arr.map((item, i) => ({
          id: item.id ?? item.jobId ?? i,
          title: item.title ?? item.role ?? item.jobTitle ?? `Job ${i + 1}`,
          company: item.company ?? item.organization ?? item.employer ?? "Unknown Company",
          type: item.type ?? item.sector ?? (String(item.organization ?? "").toLowerCase().includes("gov") ? "Government" : "Private"),
          location: item.location ?? item.city ?? "Remote / India",
          meta: (() => {
            const parts = [];
            if (item.sector) parts.push(item.sector);
            if (item.organization) parts.push(item.organization);
            if (item.city) parts.push(item.city);
            return parts.join(" • ");
          })(),
          description: item.description ?? item.summary ?? item.about ?? "No description available.",
          salary: item.salary ?? item.pay ?? "",
          experience: item.experience ?? item.experienceRequired ?? "",
          skills: item.skills ?? item.keySkills ?? [],
          applyLink: item.applyLink ?? item.url ?? "#",
          postedOn: item.postedOn ?? item.datePosted ?? "",
        }));

        setJobs(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Pagination calculations
  const total = jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleJobs = jobs.slice(startIndex, endIndex);

  const goToPage = (p) => {
    const page = Math.min(Math.max(1, p), totalPages);
    setCurrentPage(page);
    // scroll to top of list for better UX
    const el = document.querySelector(".jobs-wrapper");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <div className="jobs-loading">Loading jobs...</div>;
  if (error) return <div className="jobs-error">Error: {error}</div>;

  return (
    <section className="jobs-wrapper">
      <div className="jobs-header">
        <h1>🌱 Job Opportunities</h1>
        <p>Govt & Private roles in Agritech — from internships to full-time.</p>
      </div>

      <div className="jobs-grid">
        {visibleJobs.length === 0 ? (
          <div className="no-jobs">No jobs found.</div>
        ) : (
          visibleJobs.map((job) => (
            <article className="job-tile" key={job.id}>
              <div className="tile-top">
                <button className="tile-icon" aria-hidden>—</button>
                <h2 className="tile-title">{job.title}</h2>
              </div>

              <div className="tile-meta">
                <span className="tile-company">{job.company}</span>
                {job.meta && <div className="tile-sub">{job.meta}</div>}
              </div>

              <p className="tile-desc">{job.description}</p>

              <div className="tile-row">
                {job.location && <div className="tile-small">📍 {job.location}</div>}
                {job.salary && <div className="tile-small">💰 {job.salary}</div>}
                {job.experience && <div className="tile-small">👔 Experience: {job.experience}</div>}
              </div>

              <div className="tile-actions">
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Apply
                </a>
                <button
                  className="btn btn-outline"
                  onClick={() => alert(`${job.title}\n\n${job.description}`)}
                >
                  Details
                </button>
              </div>

              {job.postedOn && <div className="posted">📅 Posted on: {job.postedOn}</div>}
            </article>
          ))
        )}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Prev
        </button>

        {/* show page numbers with a window */}
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          // show nearby pages and first/last
          if (
            p === 1 ||
            p === totalPages ||
            (p >= currentPage - 1 && p <= currentPage + 1)
          ) {
            return (
              <button
                key={p}
                className={`page-number ${p === currentPage ? "active" : ""}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            );
          }
          // show ellipsis if needed
          if (p === 2 && currentPage > 3) return <span key="left-ellipsis" className="ellipsis">…</span>;
          if (p === totalPages - 1 && currentPage < totalPages - 2) return <span key="right-ellipsis" className="ellipsis">…</span>;
          return null;
        })}

        <button
          className="page-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default JobOpportunities;
