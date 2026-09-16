import {
  doc, getDoc, setDoc, updateDoc,
  increment, serverTimestamp,
  collection, addDoc, getDocs, deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const SUMMARY_DOC = doc(db, "analytics", "summary");
const VISITS_COL = collection(db, "analytics_visits");
const DAILY_COL = collection(db, "analytics_daily");
const SESSION_KEY = "mj_portfolio_visited";

/* ---------- User-agent parsing (no library) ---------- */

function parseUA(ua) {
  const s = ua || "";

  // Browser
  let browser = "Unknown";
  if (/Edg\//.test(s)) browser = "Edge";
  else if (/OPR\/|Opera/.test(s)) browser = "Opera";
  else if (/Chrome\//.test(s) && !/Edg\//.test(s)) browser = "Chrome";
  else if (/Firefox\//.test(s)) browser = "Firefox";
  else if (/Safari\//.test(s) && !/Chrome/.test(s)) browser = "Safari";

  // OS
  let os = "Unknown";
  if (/Windows NT 10/.test(s)) os = "Windows 10/11";
  else if (/Windows NT/.test(s)) os = "Windows";
  else if (/Mac OS X/.test(s)) os = "macOS";
  else if (/Android/.test(s)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(s)) os = "iOS";
  else if (/Linux/.test(s)) os = "Linux";

  // Device type
  let device = "Desktop";
  if (/Mobi|Android|iPhone/.test(s)) device = "Mobile";
  else if (/iPad|Tablet/.test(s)) device = "Tablet";

  return { browser, os, device };
}

/* ---------- Geo lookup (ipwho.is) ---------- */

async function fetchGeo() {
  try {
    const res = await fetch("https://ipwho.is/");
    if (!res.ok) throw new Error("geo request failed");
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "geo failed");

    return {
      ip: data.ip || "unknown",
      country: data.country || "",
      countryCode: data.country_code || "",
      region: data.region || "",
      city: data.city || "",
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      timezone: data.timezone?.id || "",
      isp: data.connection?.isp || "",
    };
  } catch (err) {
    console.warn("[analytics] geo lookup failed:", err.message);
    return {
      ip: "unknown",
      country: "",
      countryCode: "",
      region: "",
      city: "",
      latitude: null,
      longitude: null,
      timezone: "",
      isp: "",
    };
  }
}

/* ---------- Main tracker ---------- */

export async function trackVisit() {
  if (sessionStorage.getItem(SESSION_KEY)) return;

  const today = new Date().toISOString().split("T")[0];
  const dayDoc = doc(db, "analytics_daily", today);

  // ---- 1. Gather metadata ----
  const geo = await fetchGeo();
  const ua = navigator.userAgent;
  const { browser, os, device } = parseUA(ua);

  const visit = {
    // geo
    ip: geo.ip,
    country: geo.country,
    countryCode: geo.countryCode,
    region: geo.region,
    city: geo.city,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: geo.timezone,
    isp: geo.isp,
    // device / browser
    browser,
    os,
    device,
    userAgent: ua,
    language: navigator.language || "",
    screen: `${window.screen.width}x${window.screen.height}`,
    // context
    referrer: document.referrer || "direct",
    page: window.location.pathname,
    // time
    timestamp: serverTimestamp(),
    date: today,
    time: new Date().toISOString(),
  };

  // ---- 2. Write visit log ----
  await addDoc(VISITS_COL, visit);

  // ---- 3. Update summary ----
  const snap = await getDoc(SUMMARY_DOC);
  if (!snap.exists()) {
    await setDoc(SUMMARY_DOC, {
      total: 1,
      today: 1,
      lastDate: today,
      lastVisit: serverTimestamp(),
    });
  } else {
    const data = snap.data();
    const isNewDay = data.lastDate !== today;
    await updateDoc(SUMMARY_DOC, {
      total: increment(1),
      today: isNewDay ? 1 : increment(1),
      lastDate: today,
      lastVisit: serverTimestamp(),
    });
  }

  // ---- 4. Update daily ----
  const daySnap = await getDoc(dayDoc);
  if (!daySnap.exists()) {
    await setDoc(dayDoc, { count: 1, date: today });
  } else {
    await updateDoc(dayDoc, { count: increment(1) });
  }

  sessionStorage.setItem(SESSION_KEY, "1");
}

/* ---------- Read side ---------- */

export async function getAnalyticsSummary() {
  const snap = await getDoc(SUMMARY_DOC);
  return snap.exists()
    ? snap.data()
    : { total: 0, today: 0, lastDate: "", lastVisit: null };
}

export async function getDailyHistory(limit = 14) {
  const snap = await getDocs(DAILY_COL);
  const list = snap.docs.map((d) => d.data());
  return list
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, limit);
}

export async function getVisits(limit = 100) {
  const snap = await getDocs(VISITS_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list
    .sort((a, b) => (b.time || "").localeCompare(a.time || ""))
    .slice(0, limit);
}

export async function deleteVisit(id) {
  if (!id) return;
  await deleteDoc(doc(db, "analytics_visits", id));
}

export async function clearAllVisits() {
  const snap = await getDocs(VISITS_COL);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}