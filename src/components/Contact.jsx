// import { useState } from "react";
// import SectionTitle from "./SectionTitle";
// import { sendContactEmail } from "../services/emailService";

// function Contact() {

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [status, setStatus] = useState({
//     type: "",
//     message: "",
//   });

//   const [sending, setSending] = useState(false);

//   const handleChange = (event) => {
//     setForm({
//       ...form,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {

//     event.preventDefault();

//     setSending(true);

//     setStatus({
//       type: "",
//       message: "",
//     });

//     try {

//       await sendContactEmail(form);

//       setStatus({
//         type: "success",
//         message:
//           "Message transmitted successfully. I'll get back to you soon.",
//       });

//       setForm({
//         name: "",
//         email: "",
//         subject: "",
//         message: "",
//       });

//     } catch (error) {

//       console.error(error);

//       setStatus({
//         type: "error",
//         message:
//           "Transmission failed. Please try again later.",
//       });

//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <section id="contact" className="section contact-section">

//       <div className="container">

//         <SectionTitle
//           number="04"
//           title="Contact"
//           subtitle="Let's build something together"
//         />

//         <div className="contact-grid">

//           <div className="contact-info">

//             <div className="code-comment">
//               // Establish connection
//             </div>

//             <h3>
//               Have a project or
//               <span> opportunity?</span>
//             </h3>

//             <p>
//               I'm currently open to entry-level software
//               development opportunities, collaborations and
//               interesting projects.
//             </p>

//             <div className="contact-method">

//               <span className="contact-symbol">
//                 @
//               </span>

//               <div>
//                 <small>EMAIL</small>

//                 <a href="mailto:mohamedjasithoff@gmail.com">
//                   mohamedjasithoff@gmail.com
//                 </a>
//               </div>

//             </div>

//             <div className="contact-method">

//               <span className="contact-symbol">
//                 GH
//               </span>

//               <div>
//                 <small>GITHUB</small>

//                 <a
//                   href="https://github.com/mdjasith"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   github.com/mdjasith
//                 </a>
//               </div>

//             </div>

//             <div className="contact-method">

//               <span className="contact-symbol">
//                 in
//               </span>

//               <div>
//                 <small>LINKEDIN</small>

//                 <a
//                   href="https://www.linkedin.com/"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   LinkedIn Profile
//                 </a>
//               </div>

//             </div>

//           </div>

//           <form
//             className="contact-form"
//             onSubmit={handleSubmit}
//           >

//             <div className="form-row">

//               <div className="form-group">

//                 <label htmlFor="name">
//                   NAME
//                 </label>

//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Your name"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//               <div className="form-group">

//                 <label htmlFor="email">
//                   EMAIL
//                 </label>

//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="your@email.com"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//             </div>

//             <div className="form-group">

//               <label htmlFor="subject">
//                 SUBJECT
//               </label>

//               <input
//                 id="subject"
//                 name="subject"
//                 type="text"
//                 placeholder="Project / Job opportunity"
//                 value={form.subject}
//                 onChange={handleChange}
//                 required
//               />

//             </div>

//             <div className="form-group">

//               <label htmlFor="message">
//                 MESSAGE
//               </label>

//               <textarea
//                 id="message"
//                 name="message"
//                 rows="7"
//                 placeholder="Write your message..."
//                 value={form.message}
//                 onChange={handleChange}
//                 required
//               ></textarea>

//             </div>

//             {status.message && (
//               <div
//                 className={`form-status ${status.type}`}
//               >
//                 {status.message}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="btn btn-primary form-submit"
//               disabled={sending}
//             >
//               {sending
//                 ? "TRANSMITTING..."
//                 : "SEND MESSAGE →"}
//             </button>

//           </form>

//         </div>

//       </div>

//     </section>
//   );
// }

// export default Contact;





import { useState, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import { sendContactEmail } from "../services/emailService";
import { getPortfolioMeta } from "../services/portfolioService";
import {
  MailLogo,
  GithubLogo,
  LinkedinLogo,
  DownloadLogo,
} from "./ContactLogo";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    let mounted = true;

    getPortfolioMeta()
      .then((meta) => {
        if (mounted && meta?.resumeUrl) setResumeUrl(meta.resumeUrl);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      await sendContactEmail(form);
      setStatus({
        type: "success",
        message:
          "Message transmitted successfully. I'll get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Transmission failed. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionTitle
          number="04"
          title="Contact"
          subtitle="Let's build something together"
        />

        <div className="contact-grid">
          <div className="contact-info">
            <div className="code-comment">// Establish connection</div>

            <h3>
              Have a project or
              <span> opportunity?</span>
            </h3>

            <p>
              I'm currently open to entry-level software development
              opportunities, collaborations and interesting projects.
            </p>

            <div className="contact-method">
              <span className="contact-symbol">
                <MailLogo size={20} />
              </span>
              <div>
                <small>EMAIL</small>
                <a href="mailto:mohamedjasithoff@gmail.com">
                  mohamedjasithoff@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-method">
              <span className="contact-symbol">
                <GithubLogo size={20} />
              </span>
              <div>
                <small>GITHUB</small>
                <a
                  href="https://github.com/mdjasith"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/mdjasith
                </a>
              </div>
            </div>

            <div className="contact-method">
              <span className="contact-symbol">
                <LinkedinLogo size={20} />
              </span>
              <div>
                <small>LINKEDIN</small>
                <a
                  href="https://www.linkedin.com/in/mohamed-jasith-j/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="btn btn-outline contact-cv-button"
              >
                <DownloadLogo size={16} />
                DOWNLOAD CV
              </a>
            )}
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">NAME</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">SUBJECT</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Project / Job opportunity"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>
              <textarea
                id="message"
                name="message"
                rows="7"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={sending}
            >
              {sending ? "TRANSMITTING..." : "SEND MESSAGE →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;