// import { portfolioData } from "../data/portfolioData";

// function Footer() {
//   return (
//     <footer className="footer">

//       <div className="container footer-container">

//         <div className="footer-brand">

//           <a href="#home" className="logo">
//             <span>&lt;</span>
//             MJ
//             <span>/&gt;</span>
//           </a>

//           <p>
//             {portfolioData.role}
//           </p>

//         </div>

//         <div className="footer-links">

//           <a href="#home">Home</a>
//           <a href="#about">About</a>
//           <a href="#skills">Skills</a>
//           <a href="#projects">Projects</a>
//           <a href="#contact">Contact</a>

//         </div>

//         <div className="footer-social">

//           <a
//             href={portfolioData.github}
//             target="_blank"
//             rel="noreferrer"
//           >
//             GitHub
//           </a>

//           <a
//             href={portfolioData.linkedin}
//             target="_blank"
//             rel="noreferrer"
//           >
//             LinkedIn
//           </a>

//         </div>

//       </div>

//       <div className="footer-bottom">

//         <p>
//           © {new Date().getFullYear()} Mohamed Jasith.
//           All rights reserved.
//         </p>

//         <p>
//           Built with React
//         </p>

//       </div>

//     </footer>
//   );
// }

// export default Footer;



import { portfolioData } from "../data/portfolioData";
import Logo from "./Logo";
import { GithubLogo, LinkedinLogo } from "./ContactLogo";

function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-container">

        <div className="footer-brand">

          <a href="#home" className="logo">
            <Logo />
          </a>

          <p>
            {portfolioData.role}
          </p>

        </div>

        <div className="footer-links">

          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>

        </div>

        <div className="footer-social">

          <a
            href={portfolioData.github}
            target="_blank"
            rel="noreferrer"
            className="footer-social-link"
          >
            <GithubLogo size={16} />
            <span>GitHub</span>
          </a>

          <a
            href={"//www.linkedin.com/in/mohamed-jasith-j"}
            target="_blank"
            rel="noreferrer"
            className="footer-social-link"
          >
            <LinkedinLogo size={16} />
            <span>LinkedIn</span>
          </a>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Mohamed Jasith.
          All rights reserved.
        </p>

        <p>
          Built with React
        </p>

      </div>

    </footer>
  );
}

export default Footer;