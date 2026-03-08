"use client";

import { useEffect } from "react";

export default function HashCleaner() {
  useEffect(() => {
    if (window.location.hash === "#_=_") {
      history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }, []);

  return null;
}