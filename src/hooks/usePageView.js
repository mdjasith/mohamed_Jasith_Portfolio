import { useEffect } from "react";
import { trackVisit } from "../services/analyticsService";

export default function usePageView() {
  useEffect(() => {
    trackVisit().catch((err) =>
      console.warn("[analytics] track failed:", err?.message)
    );
  }, []);
}