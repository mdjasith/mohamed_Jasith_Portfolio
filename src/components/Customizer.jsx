import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Customizer() {
  const [open, setOpen] = useState(false);

  const {
    settings,
    changeTheme,
    changeAccent,
    changeGlow,
    toggleAnimations,
    resetTheme,
  } = useTheme();

  const themes = [
  { id: "cyberpunk", name: "Cyberpunk",  description: "Neon futuristic interface",     icon: "◈" },
  { id: "retro",     name: "Retro",      description: "Beach poster · vintage red",    icon: "▣" },
  { id: "space",     name: "Space",      description: "Cosmic nebula · starfield",     icon: "✧" },
  { id: "ocean",     name: "Ocean",      description: "Deep sea · coral accents",      icon: "◍" },
  { id: "sunset",    name: "Sunset",     description: "Warm dusk gradient",            icon: "◒" },
  { id: "nineties",  name: "90s",        description: "Classic 90s web experience",    icon: "◆" },
  { id: "classic",   name: "Classic",    description: "Plain HTML, browser defaults",  icon: "●" },
  { id: "dark",      name: "Dark",       description: "Modern dark developer theme",   icon: "◐" },
  { id: "matrix",    name: "Matrix",     description: "Green digital terminal",        icon: "▤" },
  { id: "vaporwave", name: "Vaporwave",  description: "Purple retro-futuristic",       icon: "◇" },
  { id: "noir",      name: "Noir",       description: "Cinema black · crimson",        icon: "◭" },
];

  const accents = [
    { id: "cyan",   name: "Cyan"   },
    { id: "purple", name: "Purple" },
    { id: "green",  name: "Green"  },
    { id: "pink",   name: "Pink"   },
    { id: "orange", name: "Orange" },
    { id: "red",    name: "Red"    },
  ];

  return (
    <>
      <button
        type="button"
        className="customizer-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open customization panel"
      >
        <span className="customizer-trigger-icon">⚙</span>
        <span>CUSTOMIZE</span>
      </button>

      {open && (
        <div
          className="customizer-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <aside
            className="customizer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="customizer-header">
              <div>
                <div className="customizer-system-label">SYSTEM CONFIGURATION</div>
                <h2>Customize</h2>
              </div>
              <button
                className="customizer-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="customizer-status">
              <span className="status-dot"></span>
              <span>
                ACTIVE THEME:{" "}
                <strong>{settings.theme.toUpperCase()}</strong>
              </span>
            </div>

            {/* THEME */}
            <section className="customizer-section">
              <div className="customizer-section-title">
                <span>01</span>
                <h3>SELECT THEME</h3>
              </div>
              <div className="theme-grid">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`theme-option ${settings.theme === t.id ? "active" : ""}`}
                    onClick={() => changeTheme(t.id)}
                    aria-pressed={settings.theme === t.id}
                  >
                    <span className="theme-option-icon">{t.icon}</span>
                    <span className="theme-option-content">
                      <strong>{t.name}</strong>
                      <small>{t.description}</small>
                    </span>
                    {settings.theme === t.id && (
                      <span className="theme-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* ACCENT */}
            <section className="customizer-section">
              <div className="customizer-section-title">
                <span>02</span>
                <h3>ACCENT COLOR</h3>
              </div>
              <div className="accent-grid">
                {accents.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={`accent-option accent-${a.id} ${settings.accent === a.id ? "active" : ""}`}
                    onClick={() => changeAccent(a.id)}
                    aria-pressed={settings.accent === a.id}
                  >
                    <span className="accent-color-dot"></span>
                    <span>{a.name}</span>
                    {settings.accent === a.id && (
                      <span className="accent-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* GLOW */}
            <section className="customizer-section">
              <div className="customizer-section-title">
                <span>03</span>
                <h3>GLOW INTENSITY</h3>
              </div>
              <div className="segmented-control">
                {["low", "medium", "high"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={settings.glow === g ? "active" : ""}
                    onClick={() => changeGlow(g)}
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            {/* ANIMATIONS */}
            <section className="customizer-section">
              <div className="customizer-section-title">
                <span>04</span>
                <h3>ANIMATIONS</h3>
              </div>
              <button
                type="button"
                className={`animation-toggle ${settings.animations ? "enabled" : ""}`}
                onClick={toggleAnimations}
                aria-pressed={settings.animations}
              >
                <span className="toggle-switch"><span></span></span>
                <span>
                  <strong>{settings.animations ? "ENABLED" : "DISABLED"}</strong>
                  <small>Interface animations and visual effects</small>
                </span>
              </button>
            </section>

            <div className="customizer-footer">
              <button
                type="button"
                className="reset-theme-button"
                onClick={resetTheme}
              >
                ↻ RESET
              </button>
              <button
                type="button"
                className="done-theme-button"
                onClick={() => setOpen(false)}
              >
                APPLY & CLOSE
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Customizer;