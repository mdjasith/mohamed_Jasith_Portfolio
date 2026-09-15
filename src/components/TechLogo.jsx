// const LOGO_MAP = {
//   java:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
//   spring:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
//   "spring boot": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
//   mysql:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
//   javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
//   react:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
//   html:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
//   css:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
//   git:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
//   firebase:   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
//   node:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
//   vite:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
// };

// export default function TechLogo({ name, size = 22 }) {
//   const key = (name || "").toLowerCase().trim();
//   const src = LOGO_MAP[key];
//   if (!src) return null;
//   return (
//     <img
//       src={src}
//       alt={name}
//       width={size}
//       height={size}
//       loading="lazy"
//       className="tech-logo"
//     />
//   );
// }


const LOGO_MAP = {
  java:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  spring:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  "spring boot": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  mysql:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  javascript:    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  js:            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  react:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "react js":    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  html:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  html5:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css:           "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  css3:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  git:           "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  firebase:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  node:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  nodejs:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  vite:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
  python:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  mongodb:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  bootstrap:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  tailwind:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
};

export default function TechLogo({ name, size = 22 }) {
  const key = (name || "").toLowerCase().trim();
  const src = LOGO_MAP[key];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className="tech-logo"
    />
  );
}