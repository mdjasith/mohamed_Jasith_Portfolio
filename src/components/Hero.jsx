import { useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { getPortfolioMeta } from "../services/portfolioService";
import FloatingIcons from "./FloatingIcons";

function Hero() {
  const roles = [
    "Software Developer",
    "Java Developer",
    "Spring Boot Developer",
    "React Developer",
    "Full Stack Developer",
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  /* ---- typing animation ---- */
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = deleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplayText(
          currentRole.substring(0, displayText.length + 1)
        );

        if (displayText === currentRole) {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        setDisplayText(
          currentRole.substring(0, displayText.length - 1)
        );

        if (displayText === "") {
          setDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, deleting, roleIndex]);

  /* ---- fetch resume URL from Firestore ---- */
  useEffect(() => {
    let mounted = true;

    getPortfolioMeta()
      .then((meta) => {
        if (mounted && meta?.resumeUrl) {
          setResumeUrl(meta.resumeUrl);
        }
      })
      .catch((err) => {
        console.warn("Resume meta not loaded:", err?.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="home" className="hero-section">

      <div className="cyber-grid"></div>

      <FloatingIcons />

      <div className="hero-orb orb-one"></div>
      <div className="hero-orb orb-two"></div>

      <div className="container hero-container">

        <div className="hero-content">

          <p className="hero-intro">
            Hello, I'm
          </p>

          <h1>
            {portfolioData.name}
            <span className="neon-dot">.</span>
          </h1>

          <div className="typing-wrapper">
            <span className="typing-prefix">&gt; </span>
            <span className="typing-text">
              {displayText}
            </span>
            <span className="cursor">_</span>
          </div>

          <p className="hero-description">
            {portfolioData.description}
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              <span>VIEW PROJECTS</span>
              <span>→</span>
            </a>

            <a href="#contact" className="btn btn-outline">
              CONTACT ME
            </a>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="btn btn-outline hero-cv-button"
              >
                DOWNLOAD CV ↓
              </a>
            )}
          </div>

          <div className="hero-stats">

            <div className="stat">
              <strong>03+</strong>
              <span>Projects</span>
            </div>

            <div className="stat-line"></div>

            <div className="stat">
              <strong>07+</strong>
              <span>Technologies</span>
            </div>

            <div className="stat-line"></div>

            <div className="stat">
              <strong>24/7</strong>
              <span>Learning</span>
            </div>

          </div>

        </div>

        <div className="hero-terminal-wrapper">
          <div className="floating-code code-one">
            &lt;code /&gt;
          </div>

          <div className="hero-terminal">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span>jasith@portfolio:~</span>
            </div>

            <div className="terminal-body">
              <p>
                <span className="terminal-green">
                  jasith@dev
                </span>
                :~$ whoami
              </p>

              <p className="terminal-output">
                Mohamed Jasith
              </p>

              <p>
                <span className="terminal-green">
                  jasith@dev
                </span>
                :~$ stack
              </p>

              <p className="terminal-output">
                Java → Spring Boot → MySQL
              </p>

              <p className="terminal-output">
                React → JavaScript → CSS
              </p>

              <p>
                <span className="terminal-green">
                  jasith@dev
                </span>
                :~$ status
              </p>

              <p className="terminal-success">
                ✓ Ready to build
              </p>

              <p>
                <span className="terminal-green">
                  jasith@dev
                </span>
                :~$
                <span className="terminal-cursor">▋</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <a href="#about" className="scroll-indicator">
        <span>SCROLL</span>
        <div></div>
      </a>

    </section>
  );
}

export default Hero;