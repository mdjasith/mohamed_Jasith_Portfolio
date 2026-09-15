// import SectionTitle from "./SectionTitle";
// import { portfolioData } from "../data/portfolioData";

// function About() {
//   return (
//     <section id="about" className="section about-section">

//       <div className="container">

//         <SectionTitle
//           number="01"
//           title="About Me"
//           subtitle="A little information about who I am"
//         />

//         <div className="about-grid">

//           <div className="about-card">

//             <div className="about-card-top">
//               <span>01</span>
//               <span>ABOUT.JSX</span>
//             </div>

//             <div className="about-avatar">
//               <div className="avatar-frame">
//                 <span>MJ</span>
//               </div>
//             </div>

//             <h3>
//               {portfolioData.name}
//             </h3>

//             <p className="about-role">
//               {portfolioData.role}
//             </p>

//             <div className="about-location">
//               <span>⌖</span>
//               {portfolioData.location}
//             </div>

//           </div>

//           <div className="about-content">

//             <div className="code-comment">
//               // About my journey
//             </div>

//             <h3>
//               Turning ideas into
//               <span> working software.</span>
//             </h3>

//             <p>
//               I'm an entry-level software developer with
//               a strong interest in full-stack application
//               development.
//             </p>

//             <p>
//               My primary development stack includes
//               Java, Spring Boot, MySQL, JavaScript and
//               React. I enjoy creating applications that
//               are functional, responsive and easy to use.
//             </p>

//             <p>
//               I'm continuously learning new technologies,
//               improving my problem-solving skills and
//               looking for opportunities where I can
//               contribute to real-world software projects.
//             </p>

//             <div className="about-highlights">

//               <div>
//                 <span className="highlight-icon">⌘</span>
//                 <div>
//                   <strong>Problem Solver</strong>
//                   <small>Logical & analytical thinking</small>
//                 </div>
//               </div>

//               <div>
//                 <span className="highlight-icon">&lt;/&gt;</span>
//                 <div>
//                   <strong>Developer</strong>
//                   <small>Full-stack application development</small>
//                 </div>
//               </div>

//               <div>
//                 <span className="highlight-icon">↗</span>
//                 <div>
//                   <strong>Continuous Learner</strong>
//                   <small>Always improving my skills</small>
//                 </div>
//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }

// export default About;






import SectionTitle from "./SectionTitle";
import { portfolioData } from "../data/portfolioData";

function About() {
  return (
    <section id="about" className="section about-section">

      <div className="container">

        <SectionTitle
          number="01"
          title="About Me"
          subtitle="A little information about who I am"
        />

        <div className="about-grid">

          <div className="about-card">

            <div className="about-card-top">
              <span>01</span>
              <span>ABOUT.JSX</span>
            </div>

            <div className="about-avatar">
              <div className="avatar-frame">
                <span>MJ</span>
              </div>
            </div>

            <h3>
              {portfolioData.name}
            </h3>

            <p className="about-role">
              {portfolioData.role}
            </p>

            <div className="about-location">
              <span>⌖</span>
              {portfolioData.location}
            </div>

          </div>

          <div className="about-content">

            <div className="code-comment">
              // About my journey
            </div>

            <h3>
              Turning ideas into
              <span> working software.</span>
            </h3>

            <p>
              I'm a <strong>B.Tech Information Technology graduate</strong> and
              an entry-level software developer with a strong interest in
              full-stack application development.
            </p>

            <p>
              My primary development stack includes
              Java, Spring Boot, MySQL, JavaScript and
              React. I enjoy creating applications that
              are functional, responsive and easy to use.
            </p>

            <p>
              I'm continuously learning new technologies,
              improving my problem-solving skills and
              looking for opportunities where I can
              contribute to real-world software projects.
            </p>

            <div className="about-highlights">

              <div>
                <span className="highlight-icon">⌘</span>
                <div>
                  <strong>Problem Solver</strong>
                  <small>Logical & analytical thinking</small>
                </div>
              </div>

              <div>
                <span className="highlight-icon">&lt;/&gt;</span>
                <div>
                  <strong>Developer</strong>
                  <small>Full-stack application development</small>
                </div>
              </div>

              <div>
                <span className="highlight-icon">↗</span>
                <div>
                  <strong>Continuous Learner</strong>
                  <small>Always improving my skills</small>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default About;