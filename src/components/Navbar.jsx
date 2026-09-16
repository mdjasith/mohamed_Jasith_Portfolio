import { useState } from "react";
import Logo from "./Logo";
import Customizer from "./Customizer";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          <a href="#home" className="logo" onClick={closeMenu}>
            <Logo />
          </a>

          <button
            className={`mobile-menu-button ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#skills" onClick={closeMenu}>Skills</a>
            <a href="#projects" onClick={closeMenu}>Projects</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a href="/admin/login" className="nav-admin" onClick={closeMenu}>
              Admin
            </a>
          </nav>
        </div>
      </header>

      {/* Floating trigger — always visible */}
      <Customizer />
    </>
  );
}

export default Navbar;