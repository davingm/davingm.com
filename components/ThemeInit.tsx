"use client";

import { useLayoutEffect } from "react";

export function ThemeInit() {
  useLayoutEffect(() => {
    let theme: string | null = null;

    try {
      theme = localStorage.getItem("theme");
    } catch (error) {
      console.error("Unable to read saved theme:", error);
    }

    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    document.documentElement.classList.toggle("is-offline", !navigator.onLine);
  }, []);

  return null;
}
