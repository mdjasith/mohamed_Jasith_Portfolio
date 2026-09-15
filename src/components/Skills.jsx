// import { portfolioData } from "../data/portfolioData";
// import SectionTitle from "./SectionTitle";



// import TechLogo from "./TechLogo";

// function Skills() {
//   return (
//     <section id="skills" className="section skills-section">

//       <div className="container">

//         <SectionTitle
//           number="02"
//           title="Skills"
//           subtitle="Technologies and tools I work with"
//         />

//         <div className="skills-grid">

//           {portfolioData.skills.map((skill, index) => (
//             <div
//               className="skill-card"
//               key={skill.name}
//             >

//               <div className="skill-card-header">

//                 <div className="skill-icon">
//                   {index + 1}
//                 </div>


//                         <div className="skill-card-header">
//             <div className="skill-icon">{index + 1}</div>
//             <TechLogo name={skill.name} size={20} />
//             <div>
//                 <h3>{skill.name}</h3>
//                 <span>{skill.category}</span>
//             </div>
//             <strong>{skill.level}%</strong>
//             </div>








//                 <div>
//                   <h3>{skill.name}</h3>
//                   <span>{skill.category}</span>
//                 </div>

//                 <strong>
//                   {skill.level}%
//                 </strong>

//               </div>

//               <div className="skill-bar">
//                 <div
//                   className="skill-progress"
//                   style={{
//                     width: `${skill.level}%`,
//                   }}
//                 ></div>
//               </div>

//             </div>
//           ))}

//         </div>

//         {/* <div className="skills-stack">

//           <span>JAVA</span>
//           <span>SPRING BOOT</span>
//           <span>REACT</span>
//           <span>JAVASCRIPT</span>
//           <span>MYSQL</span>
//           <span>HTML</span>
//           <span>CSS</span>
//           <span>GIT</span>

//         </div> */}


//         <div className="skills-stack">
//   {["Java","Spring Boot","React","JavaScript","MySQL","HTML","CSS","Git"].map((s) => (
//     <span key={s}><TechLogo name={s} size={16} /> {s}</span>
//   ))}
// </div>

//       </div>

//     </section>
//   );
// }

// export default Skills;



import { useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";
import SectionTitle from "./SectionTitle";
import TechLogo from "./TechLogo";
import { getSkills } from "../services/portfolioService";

function Skills() {
  const [skills, setSkills] = useState(portfolioData.skills || []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    getSkills()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.warn("Skills fetch failed, using local data:", err?.message);
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionTitle
          number="02"
          title="Skills"
          subtitle="Technologies and tools I work with"
        />

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div className="skill-card" key={skill.id || `${skill.name}-${index}`}>
              <div className="skill-card-header">
                <div className="skill-icon">{index + 1}</div>

                <TechLogo name={skill.name} size={20} />

                <div className="skill-info">
                  <h3>{skill.name}</h3>
                  <span>{skill.category}</span>
                </div>

                <strong>{skill.level}%</strong>
              </div>

              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="skills-stack">
          {["Java", "Spring Boot", "React", "JavaScript", "MySQL", "HTML", "CSS", "Git"].map(
            (s) => (
              <span key={s}>
                <TechLogo name={s} size={16} /> {s}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default Skills;