"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
}

function getServerSnapshot() {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("theme-change", { detail: nextTheme }));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)] transition-colors focus:outline-none"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 hover:text-amber-400 transition-colors" />
      ) : (
        <Moon className="w-4 h-4 hover:text-indigo-600 transition-colors" />
      )}
    </button>
  );
}
