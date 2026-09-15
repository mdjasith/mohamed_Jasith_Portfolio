// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   deleteDoc,
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   orderBy,
//   serverTimestamp,
// } from "firebase/firestore";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import { db, storage } from "./firebase";

// /* ---------- ABOUT / CONTACT / RESUME (single doc) ---------- */

// const META_DOC = doc(db, "portfolio", "meta");

// export async function getPortfolioMeta() {
//   const snap = await getDoc(META_DOC);
//   return snap.exists() ? snap.data() : null;
// }

// export async function savePortfolioMeta(data) {
//   await setDoc(META_DOC, { ...data, updatedAt: serverTimestamp() }, { merge: true });
// }

// /* ---------- SKILLS ---------- */

// const SKILLS_COL = collection(db, "skills");

// export async function getSkills() {
//   const snap = await getDocs(query(SKILLS_COL, orderBy("order", "asc")));
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// }

// export async function addSkill(skill) {
//   return addDoc(SKILLS_COL, { ...skill, createdAt: serverTimestamp() });
// }

// export async function updateSkill(id, skill) {
//   return updateDoc(doc(db, "skills", id), skill);
// }

// export async function deleteSkill(id) {
//   return deleteDoc(doc(db, "skills", id));
// }

// /* ---------- PROJECTS ---------- */

// const PROJECTS_COL = collection(db, "projects");

// export async function getProjects() {
//   const snap = await getDocs(query(PROJECTS_COL, orderBy("order", "asc")));
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// }

// export async function addProject(project) {
//   return addDoc(PROJECTS_COL, { ...project, createdAt: serverTimestamp() });
// }

// export async function updateProject(id, project) {
//   return updateDoc(doc(db, "projects", id), project);
// }

// export async function deleteProject(id) {
//   return deleteDoc(doc(db, "projects", id));
// }

// /* ---------- RESUME (Firebase Storage) ---------- */

// export async function uploadResume(file) {
//   if (!file) throw new Error("No file selected");
//   const path = `resume/${Date.now()}-${file.name}`;
//   const storageRef = ref(storage, path);
//   await uploadBytes(storageRef, file);
//   const url = await getDownloadURL(storageRef);
//   await savePortfolioMeta({ resumeUrl: url, resumePath: path });
//   return url;
// }

// export async function deleteResume(path) {
//   if (!path) return;
//   try {
//     await deleteObject(ref(storage, path));
//   } catch (e) {
//     console.warn("Resume delete skipped:", e.message);
//   }
//   await savePortfolioMeta({ resumeUrl: "", resumePath: "" });
// }



import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

/* ---------- ABOUT / CONTACT / RESUME ---------- */

const META_DOC = doc(db, "portfolio", "meta");

export async function getPortfolioMeta() {
  const snap = await getDoc(META_DOC);
  return snap.exists() ? snap.data() : null;
}

export async function savePortfolioMeta(data) {
  await setDoc(
    META_DOC,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/* ---------- SKILLS ---------- */

const SKILLS_COL = collection(db, "skills");

export async function getSkills() {
  const snap = await getDocs(SKILLS_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addSkill(skill) {
  return addDoc(SKILLS_COL, { ...skill, createdAt: serverTimestamp() });
}

export async function updateSkill(id, skill) {
  if (!id) throw new Error("Missing skill id");
  return updateDoc(doc(db, "skills", id), skill);
}

export async function deleteSkill(id) {
  if (!id) throw new Error("Missing skill id");
  return deleteDoc(doc(db, "skills", id));
}

/* ---------- PROJECTS ---------- */

const PROJECTS_COL = collection(db, "projects");

export async function getProjects() {
  const snap = await getDocs(PROJECTS_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addProject(project) {
  return addDoc(PROJECTS_COL, { ...project, createdAt: serverTimestamp() });
}

export async function updateProject(id, project) {
  if (!id) throw new Error("Missing project id");
  return updateDoc(doc(db, "projects", id), project);
}

export async function deleteProject(id) {
  if (!id) throw new Error("Missing project id");
  return deleteDoc(doc(db, "projects", id));
}

/* ---------- RESUME ---------- */

export async function uploadResume(file) {
  if (!file) throw new Error("No file selected");

  const path = `resume/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const storageRef = ref(storage, path);

  console.log("[resume] uploading to:", path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  console.log("[resume] uploaded, url:", url);

  await savePortfolioMeta({ resumeUrl: url, resumePath: path });
  return url;
}

export async function deleteResume(path) {
  if (path) {
    try {
      await deleteObject(ref(storage, path));
    } catch (e) {
      console.warn("Resume file delete skipped:", e.message);
    }
  }
  await savePortfolioMeta({ resumeUrl: "", resumePath: "" });
}






/* ---------- RESUME via Base64 (no Storage needed) ---------- */

export async function uploadResumeAsBase64(file) {
  if (!file) throw new Error("No file selected");

  // Firestore doc limit is 1 MiB. Base64 adds ~33% overhead.
  // Cap at 700 KB so we stay safely under the limit.
  const MAX_BYTES = 700 * 1024;
  if (file.size > MAX_BYTES) {
    throw new Error(
      `File is ${(file.size / 1024).toFixed(0)} KB. Max is 700 KB. ` +
      `Compress your PDF (smallpdf.com/compress-pdf) or use Cloudinary.`
    );
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  await savePortfolioMeta({
    resumeUrl: dataUrl,
    resumeName: file.name,
    resumeType: file.type || "application/pdf",
    resumeSize: file.size,
    resumePath: "",
  });

  return dataUrl;
}

export async function deleteResumeBase64() {
  await savePortfolioMeta({
    resumeUrl: "",
    resumeName: "",
    resumeType: "",
    resumeSize: 0,
    resumePath: "",
  });
}