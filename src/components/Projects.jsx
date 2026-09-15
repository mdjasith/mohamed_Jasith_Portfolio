





// import { useEffect, useState } from "react";
// import SectionTitle from "./SectionTitle";
// import { projects as localProjects } from "../data/projectsData";
// import { getProjects } from "../services/portfolioService";

// function Projects() {
//   const [projects, setProjects] = useState(localProjects || []);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       const data = await getProjects();
//       if (Array.isArray(data) && data.length > 0) {
//         setProjects(data);
//       } else {
//         setProjects(localProjects || []);
//       }
//     } catch (err) {
//       console.warn("Projects fetch failed, using local data:", err?.message);
//       setProjects(localProjects || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <section id="projects" className="section projects-section">
//       <div className="container">
//         <SectionTitle
//           number="03"
//           title="Projects"
//           subtitle="Some things I have built"
//         />

//         <div className="projects-grid">
//           {projects.map((project, index) => {
//             const techs = Array.isArray(project.technologies)
//               ? project.technologies
//               : String(project.technologies || "")
//                   .split(",")
//                   .map((t) => t.trim())
//                   .filter(Boolean);

//             return (
//               <article
//                 className="project-card"
//                 key={project.id || `${project.title}-${index}`}
//               >
//                 <div className="project-number">0{index + 1}</div>

//                 <div className="project-top">
//                   <span className="project-category">
//                     {project.category}
//                   </span>

//                   <div className="project-links">
//                     {project.github && (
//                       <a
//                         href={project.github}
//                         target="_blank"
//                         rel="noreferrer"
//                         aria-label="GitHub"
//                       >
//                         GH
//                       </a>
//                     )}

//                     {project.live && project.live !== "#" && (
//                       <a
//                         href={project.live}
//                         target="_blank"
//                         rel="noreferrer"
//                         aria-label="Live project"
//                       >
//                         ↗
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 <div className="project-icon">{"{ }"}</div>

//                 <h3>{project.title}</h3>
//                 <p>{project.description}</p>

//                 <div className="project-tech">
//                   {techs.map((tech) => (
//                     <span key={tech}>{tech}</span>
//                   ))}
//                 </div>

//                 <div className="project-bottom">
//                   <span>PROJECT_0{index + 1}</span>
//                   <span className="project-arrow">→</span>
//                 </div>
//               </article>
//             );
//           })}
//         </div>

//         {!loading && projects.length === 0 && (
//           <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
//             No projects yet.
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }

// export default Projects;










import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { projects as localProjects } from "../data/projectsData";
import { getProjects } from "../services/portfolioService";

function Projects() {
  const [projects, setProjects] = useState(localProjects || []);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(localProjects || []);
      }
    } catch (err) {
      console.warn("Projects fetch failed, using local data:", err?.message);
      setProjects(localProjects || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionTitle
          number="03"
          title="Projects"
          subtitle="Some things I have built"
        />

        <div className="projects-grid">
          {projects.map((project, index) => {
            const techs = Array.isArray(project.technologies)
              ? project.technologies
              : String(project.technologies || "")
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);

            const hasGithub =
              project.github && project.github.trim() !== "";

            const hasLive =
              project.live &&
              project.live.trim() !== "" &&
              project.live !== "#";

            return (
              <article
                className="project-card"
                key={project.id || `${project.title}-${index}`}
              >
                <div className="project-number">0{index + 1}</div>

                <div className="project-top">
                  <span className="project-category">
                    {project.category}
                  </span>
                </div>

                <div className="project-icon">{"{ }"}</div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tech">
                  {techs.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                {(hasGithub || hasLive) && (
                  <div className="project-actions">
                    {hasGithub && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="project-btn project-btn-github"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                        </svg>
                        GITHUB
                      </a>
                    )}

                    {hasLive && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="project-btn project-btn-live"
                      >
                        GO LIVE
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {!loading && projects.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            No projects yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default Projects;