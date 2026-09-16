// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   listenToAuth,
//   logoutAdmin,
// } from "../services/authService";

// function AdminDashboard() {

//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {

//     const unsubscribe = listenToAuth((currentUser) => {

//       if (!currentUser) {
//         navigate("/admin/login");
//       } else {
//         setUser(currentUser);
//       }

//       setChecking(false);
//     });

//     return () => unsubscribe();

//   }, [navigate]);

//   const handleLogout = async () => {

//     await logoutAdmin();

//     navigate("/admin/login");
//   };

//   if (checking) {
//     return (
//       <div className="admin-loading">
//         AUTHENTICATING...
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">

//       <aside className="dashboard-sidebar">

//         <div className="dashboard-logo">
//           <span>MJ</span>
//           <small>ADMIN</small>
//         </div>

//         <nav>

//           <a href="#overview" className="active">
//             Overview
//           </a>

//           <a href="#about-data">
//             About
//           </a>

//           <a href="#skills-data">
//             Skills
//           </a>

//           <a href="#projects-data">
//             Projects
//           </a>

//           <a href="#cv-data">
//             CV / Resume
//           </a>

//         </nav>

//         <button
//           className="dashboard-logout"
//           onClick={handleLogout}
//         >
//           LOGOUT
//         </button>

//       </aside>

//       <main className="dashboard-main">

//         <header className="dashboard-header">

//           <div>
//             <span className="dashboard-status">
//               ● SYSTEM ONLINE
//             </span>

//             <h1>
//               Dashboard
//             </h1>
//           </div>

//           <div className="dashboard-user">
//             {user?.email}
//           </div>

//         </header>

//         <section
//           id="overview"
//           className="dashboard-content"
//         >

//           <div className="dashboard-card">

//             <span className="dashboard-card-number">
//               01
//             </span>

//             <h2>About</h2>

//             <p>
//               Manage your portfolio introduction and
//               personal information.
//             </p>

//             <button>
//               MANAGE →
//             </button>

//           </div>

//           <div className="dashboard-card">

//             <span className="dashboard-card-number">
//               02
//             </span>

//             <h2>Skills</h2>

//             <p>
//               Add, edit or remove your technical skills.
//             </p>

//             <button>
//               MANAGE →
//             </button>

//           </div>

//           <div className="dashboard-card">

//             <span className="dashboard-card-number">
//               03
//             </span>

//             <h2>Projects</h2>

//             <p>
//               Manage projects displayed on your portfolio.
//             </p>

//             <button>
//               MANAGE →
//             </button>

//           </div>

//           <div className="dashboard-card">

//             <span className="dashboard-card-number">
//               04
//             </span>

//             <h2>Resume</h2>

//             <p>
//               Manage your downloadable CV.
//             </p>

//             <button>
//               MANAGE →
//             </button>

//           </div>

//         </section>

//       </main>

//     </div>
//   );
// }

// export default AdminDashboard;






import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listenToAuth, logoutAdmin } from "../services/authService";
import {
  getSkills, addSkill, updateSkill, deleteSkill,
  getProjects, addProject, updateProject, deleteProject,
  getPortfolioMeta, savePortfolioMeta,
  uploadResumeAsBase64, deleteResumeBase64,
} from "../services/portfolioService";
import {
  getAnalyticsSummary,
  getDailyHistory,
  getVisits,
  deleteVisit,
  clearAllVisits,
} from "../services/analyticsService";
import TechLogo from "../components/TechLogo";

const emptySkill = { name: "", category: "", level: 50, order: 0 };
const emptyProject = {
  title: "", category: "", description: "",
  technologies: "", github: "", live: "", order: 0,
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("overview");

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({
    name: "", role: "", location: "", description: "",
    email: "", github: "", linkedin: "",
    resumeUrl: "", resumePath: "",
  });

  /* ---------- ANALYTICS STATE ---------- */
  const [analytics, setAnalytics] = useState({
    total: 0, today: 0, lastDate: "", lastVisit: null,
  });
  const [daily, setDaily] = useState([]);
  const [visits, setVisits] = useState([]);
  const [visitSearch, setVisitSearch] = useState("");

  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = listenToAuth((u) => {
      if (!u) navigate("/admin/login");
      else setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, [navigate]);

  const refresh = useCallback(async () => {
    try {
      const [s, p, m, a, d, v] = await Promise.all([
        getSkills(),
        getProjects(),
        getPortfolioMeta(),
        getAnalyticsSummary(),
        getDailyHistory(14),
        getVisits(200),
      ]);
      setSkills(s);
      setProjects(p);
      if (m) setMeta((prev) => ({ ...prev, ...m }));
      setAnalytics(a);
      setDaily(d);
      setVisits(v);
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  if (checking) return <div className="admin-loading">AUTHENTICATING...</div>;

  /* ---------- SKILLS ---------- */
  const openSkillModal = (skill) =>
    setModal({
      type: "skill",
      data: skill || { ...emptySkill, order: skills.length },
    });

  const saveSkill = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        category: data.category,
        level: Number(data.level),
        order: Number(data.order),
      };
      if (data.id) await updateSkill(data.id, payload);
      else await addSkill(payload);
      await refresh();
      setModal(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (id) => {
    if (!id) {
      alert("This skill has no ID (bad Firestore doc). Check the skills collection.");
      return;
    }
    if (!confirm("Delete this skill?")) return;

    try {
      await deleteSkill(id);
      await refresh();
    } catch (err) {
      console.error("[deleteSkill]", err);
      alert("Delete failed: " + (err?.message || err));
    }
  };

  /* ---------- PROJECTS ---------- */
  const openProjectModal = (project) =>
    setModal({
      type: "project",
      data: project || { ...emptyProject, order: projects.length },
    });

  const saveProject = async (data) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        github: data.github,
        live: data.live,
        order: Number(data.order),
        technologies: Array.isArray(data.technologies)
          ? data.technologies
          : String(data.technologies || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
      };
      if (data.id) await updateProject(data.id, payload);
      else await addProject(payload);
      await refresh();
      setModal(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async (id) => {
    if (!id) {
      alert("This project has no ID (bad Firestore doc). Check the projects collection.");
      return;
    }
    if (!confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      await refresh();
    } catch (err) {
      console.error("[deleteProject]", err);
      alert("Delete failed: " + (err?.message || err));
    }
  };

  /* ---------- META ---------- */
  const openMetaModal = (type) => setModal({ type, data: { ...meta } });

  const saveMeta = async (data) => {
    setSaving(true);
    try {
      await savePortfolioMeta(data);
      await refresh();
      setModal(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- RESUME ---------- */
  const onResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      await uploadResumeAsBase64(file);
      await refresh();
      alert("✅ Resume uploaded successfully.");
    } catch (err) {
      console.error("[uploadResumeAsBase64]", err);
      alert("❌ Upload failed\n\n" + (err?.message || err));
    } finally {
      setUploading(false);
    }
  };

  const onResumeDelete = async () => {
    if (!confirm("Delete current resume?")) return;
    try {
      await deleteResumeBase64();
      await refresh();
    } catch (err) {
      console.error("[deleteResumeBase64]", err);
      alert("Delete failed: " + (err?.message || err));
    }
  };

  /* ---------- VISITS ---------- */
  const removeVisit = async (id) => {
    if (!confirm("Delete this visit record?")) return;
    try {
      await deleteVisit(id);
      await refresh();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const wipeAllVisits = async () => {
    if (!confirm("Delete ALL visit logs? This cannot be undone.")) return;
    try {
      await clearAllVisits();
      await refresh();
    } catch (err) {
      alert("Wipe failed: " + err.message);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredVisits = visits.filter((v) => {
    if (!visitSearch) return true;
    const q = visitSearch.toLowerCase();
    return (
      (v.ip || "").toLowerCase().includes(q) ||
      (v.country || "").toLowerCase().includes(q) ||
      (v.city || "").toLowerCase().includes(q) ||
      (v.browser || "").toLowerCase().includes(q) ||
      (v.os || "").toLowerCase().includes(q) ||
      (v.device || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span>MJ</span>
          <small>ADMIN</small>
        </div>

        <nav>
          {["overview", "analytics", "visitors", "about", "skills", "projects", "resume"].map(
            (t) => (
              <a
                key={t}
                href={`#${t}`}
                className={tab === t ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(t);
                }}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </a>
            )
          )}
        </nav>

        <button className="dashboard-logout" onClick={handleLogout}>
          LOGOUT
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-status">● SYSTEM ONLINE</span>
            <h1>Dashboard</h1>
          </div>
          <div className="dashboard-user">{user?.email}</div>
        </header>

        <section className="dashboard-content" style={{ display: "block" }}>
          {/* ============ OVERVIEW ============ */}
          {tab === "overview" && (
            <div className="dashboard-cards-grid">
              <div className="dashboard-card">
                <span className="dashboard-card-number">01</span>
                <h2>Skills</h2>
                <p>{skills.length} skills in Firestore.</p>
                <button onClick={() => setTab("skills")}>MANAGE →</button>
              </div>
              <div className="dashboard-card">
                <span className="dashboard-card-number">02</span>
                <h2>Projects</h2>
                <p>{projects.length} projects in Firestore.</p>
                <button onClick={() => setTab("projects")}>MANAGE →</button>
              </div>
              <div className="dashboard-card">
                <span className="dashboard-card-number">03</span>
                <h2>Resume</h2>
                <p>{meta.resumeUrl ? "Uploaded ✓" : "Not uploaded"}</p>
                <button onClick={() => setTab("resume")}>MANAGE →</button>
              </div>
              <div className="dashboard-card">
                <span className="dashboard-card-number">04</span>
                <h2>About / Contact</h2>
                <p>Update profile & social links.</p>
                <button onClick={() => setTab("about")}>MANAGE →</button>
              </div>
              <div className="dashboard-card">
                <span className="dashboard-card-number">05</span>
                <h2>Views</h2>
                <p>
                  {analytics.total || 0} total · {analytics.today || 0} today
                </p>
                <button onClick={() => setTab("analytics")}>VIEW →</button>
              </div>
              <div className="dashboard-card">
                <span className="dashboard-card-number">06</span>
                <h2>Visitors</h2>
                <p>{visits.length} visit records.</p>
                <button onClick={() => setTab("visitors")}>VIEW →</button>
              </div>
            </div>
          )}

          {/* ============ ANALYTICS ============ */}
          {tab === "analytics" && (
            <div className="analytics-panel">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <span className="analytics-label">TOTAL VIEWS</span>
                  <strong className="analytics-value">
                    {analytics.total?.toLocaleString() || 0}
                  </strong>
                  <small className="analytics-sub">All time</small>
                </div>

                <div className="analytics-card">
                  <span className="analytics-label">TODAY</span>
                  <strong className="analytics-value">
                    {analytics.today?.toLocaleString() || 0}
                  </strong>
                  <small className="analytics-sub">
                    {analytics.lastDate || "—"}
                  </small>
                </div>

                <div className="analytics-card">
                  <span className="analytics-label">LAST 14 DAYS</span>
                  <strong className="analytics-value">
                    {daily.reduce((sum, d) => sum + (d.count || 0), 0)}
                  </strong>
                  <small className="analytics-sub">Recent traffic</small>
                </div>
              </div>

              {daily.length > 0 && (
                <div className="analytics-chart">
                  <h3>Daily views</h3>
                  <div className="analytics-bars">
                    {daily
                      .slice()
                      .reverse()
                      .map((d) => {
                        const max = Math.max(...daily.map((x) => x.count || 1));
                        const heightPct = Math.max(
                          4,
                          Math.round(((d.count || 0) / max) * 100)
                        );
                        const [, month, day] = (d.date || "").split("-");

                        return (
                          <div className="analytics-bar-wrap" key={d.date}>
                            <div
                              className="analytics-bar"
                              style={{ height: `${heightPct}%` }}
                              title={`${d.count} views on ${d.date}`}
                            />
                            <span className="analytics-bar-label">
                              {day}/{month}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {daily.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                  No data yet. Visit your portfolio home page to start counting.
                </p>
              )}
            </div>
          )}

          {/* ============ VISITORS ============ */}
          {tab === "visitors" && (
            <div className="visitors-panel">
              <div className="visitors-toolbar">
                <input
                  type="text"
                  placeholder="Search IP, country, city, browser…"
                  value={visitSearch}
                  onChange={(e) => setVisitSearch(e.target.value)}
                  className="visitors-search"
                />
                <button className="dashboard-add danger" onClick={wipeAllVisits}>
                  CLEAR ALL
                </button>
              </div>

              <div className="visitors-table-wrap">
                <table className="visitors-table">
                  <thead>
                    <tr>
                      <th>DATE / TIME</th>
                      <th>IP</th>
                      <th>LOCATION</th>
                      <th>DEVICE</th>
                      <th>BROWSER</th>
                      <th>REFERRER</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisits.map((v) => (
                      <tr key={v.id}>
                        <td>{formatDate(v.time)}</td>
                        <td className="mono">{v.ip}</td>
                        <td>
                          {v.city && <div>{v.city}</div>}
                          <small>
                            {v.region && `${v.region}, `}
                            {v.country || "—"}
                          </small>
                        </td>
                        <td>
                          {v.device}
                          <small>{v.os}</small>
                        </td>
                        <td>{v.browser}</td>
                        <td>
                          {v.referrer === "direct" ? (
                            <span className="muted">direct</span>
                          ) : (
                            <span title={v.referrer}>
                              {(v.referrer || "")
                                .replace(/^https?:\/\//, "")
                                .slice(0, 30)}
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="row-delete"
                            onClick={() => removeVisit(v.id)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredVisits.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          style={{ textAlign: "center", padding: "30px" }}
                        >
                          No visits recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ ABOUT ============ */}
          {tab === "about" && (
            <div className="dashboard-list">
              <button
                className="dashboard-add"
                onClick={() => openMetaModal("about")}
              >
                + EDIT ABOUT
              </button>
              <button
                className="dashboard-add"
                onClick={() => openMetaModal("contact")}
              >
                + EDIT CONTACT
              </button>

              <div className="dashboard-row">
                <div>
                  <strong>{meta.name || "—"}</strong>
                  <small>
                    {meta.role || "—"} · {meta.location || "—"}
                  </small>
                </div>
              </div>
              <div className="dashboard-row">
                <div>
                  <strong>{meta.email || "—"}</strong>
                  <small>
                    {meta.github} · {meta.linkedin}
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* ============ SKILLS ============ */}
          {tab === "skills" && (
            <>
              <button
                className="dashboard-add"
                onClick={() => openSkillModal()}
              >
                + ADD SKILL
              </button>

              <div className="dashboard-list">
                {skills.map((s) => (
                  <div className="dashboard-row" key={s.id}>
                    <TechLogo name={s.name} size={22} />
                    <div>
                      <strong>{s.name}</strong>
                      <small>
                        {s.category} · {s.level}%
                      </small>
                    </div>
                    <div className="row-actions">
                      <button onClick={() => openSkillModal(s)}>EDIT</button>
                      <button
                        className="danger"
                        onClick={() => removeSkill(s.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
                {!skills.length && (
                  <p style={{ color: "var(--text-muted)" }}>
                    No skills yet. Click + ADD SKILL.
                  </p>
                )}
              </div>
            </>
          )}

          {/* ============ PROJECTS ============ */}
          {tab === "projects" && (
            <>
              <button
                className="dashboard-add"
                onClick={() => openProjectModal()}
              >
                + ADD PROJECT
              </button>

              <div className="dashboard-list">
                {projects.map((p) => (
                  <div className="dashboard-row" key={p.id}>
                    <div>
                      <strong>{p.title}</strong>
                      <small>
                        {p.category} ·{" "}
                        {Array.isArray(p.technologies)
                          ? p.technologies.join(", ")
                          : ""}
                      </small>
                    </div>
                    <div className="row-actions">
                      <button onClick={() => openProjectModal(p)}>EDIT</button>
                      <button
                        className="danger"
                        onClick={() => removeProject(p.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
                {!projects.length && (
                  <p style={{ color: "var(--text-muted)" }}>
                    No projects yet. Click + ADD PROJECT.
                  </p>
                )}
              </div>
            </>
          )}

          {/* ============ RESUME ============ */}
          {tab === "resume" && (
            <div className="dashboard-list">
              <div className="dashboard-row">
                <div>
                  <strong>Resume / CV</strong>
                  <small>{meta.resumeUrl ? "Uploaded" : "Not uploaded"}</small>
                </div>
                <div className="row-actions">
                  <label
                    style={{
                      cursor: uploading ? "wait" : "pointer",
                      color: "var(--cyan)",
                      fontSize: "0.6rem",
                      padding: "6px 10px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {uploading ? "UPLOADING..." : "UPLOAD PDF"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      onChange={onResumeUpload}
                      disabled={uploading}
                    />
                  </label>
                  {meta.resumeUrl && (
                    <button className="danger" onClick={onResumeDelete}>
                      DELETE
                    </button>
                  )}
                </div>
              </div>

              {meta.resumeUrl && (
                <a
                  href={meta.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
                >
                  View current resume ↗
                </a>
              )}
            </div>
          )}
        </section>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modal.type === "skill" && (
              <SkillForm
                data={modal.data}
                onCancel={() => setModal(null)}
                onSave={saveSkill}
                saving={saving}
              />
            )}
            {modal.type === "project" && (
              <ProjectForm
                data={modal.data}
                onCancel={() => setModal(null)}
                onSave={saveProject}
                saving={saving}
              />
            )}
            {(modal.type === "about" || modal.type === "contact") && (
              <MetaForm
                data={modal.data}
                type={modal.type}
                onCancel={() => setModal(null)}
                onSave={saveMeta}
                saving={saving}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== SUB-FORMS ================== */

function SkillForm({ data, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    id: data.id || "",
    name: data.name || "",
    category: data.category || "",
    level: data.level ?? 50,
    order: data.order ?? 0,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h3>{form.id ? "EDIT SKILL" : "ADD SKILL"}</h3>

      <div className="form-group">
        <label>NAME</label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>CATEGORY</label>
        <input
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>LEVEL ({form.level}%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={form.level}
          onChange={(e) => set("level", Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>ORDER</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
        />
      </div>

      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "SAVING..." : "SAVE"}
        </button>
      </div>
    </form>
  );
}

function ProjectForm({ data, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    id: data.id || "",
    title: data.title || "",
    category: data.category || "",
    description: data.description || "",
    technologies: Array.isArray(data.technologies)
      ? data.technologies.join(", ")
      : data.technologies || "",
    github: data.github || "",
    live: data.live || "",
    order: data.order ?? 0,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h3>{form.id ? "EDIT PROJECT" : "ADD PROJECT"}</h3>

      <div className="form-group">
        <label>TITLE</label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>CATEGORY</label>
        <input
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>DESCRIPTION</label>
        <textarea
          rows="3"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>TECHNOLOGIES (comma separated)</label>
        <input
          value={form.technologies}
          onChange={(e) => set("technologies", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>GITHUB URL</label>
        <input
          value={form.github}
          onChange={(e) => set("github", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>LIVE URL</label>
        <input
          value={form.live}
          onChange={(e) => set("live", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>ORDER</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
        />
      </div>

      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "SAVING..." : "SAVE"}
        </button>
      </div>
    </form>
  );
}

function MetaForm({ data, type, onSave, onCancel, saving }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isAbout = type === "about";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h3>{isAbout ? "EDIT ABOUT" : "EDIT CONTACT"}</h3>

      {isAbout ? (
        <>
          <div className="form-group">
            <label>NAME</label>
            <input
              value={form.name || ""}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ROLE</label>
            <input
              value={form.role || ""}
              onChange={(e) => set("role", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>LOCATION</label>
            <input
              value={form.location || ""}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea
              rows="4"
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label>EMAIL</label>
            <input
              value={form.email || ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>GITHUB</label>
            <input
              value={form.github || ""}
              onChange={(e) => set("github", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>LINKEDIN</label>
            <input
              value={form.linkedin || ""}
              onChange={(e) => set("linkedin", e.target.value)}
            />
          </div>
        </>
      )}

      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "SAVING..." : "SAVE"}
        </button>
      </div>
    </form>
  );
}

export default AdminDashboard;