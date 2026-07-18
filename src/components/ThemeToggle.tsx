import { useState } from "react";

const getCurrentTheme = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(getCurrentTheme);
  const nextTheme = theme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    document.documentElement.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      nextTheme === "dark" ? "#11120f" : "#eef0e8",
    );
    try {
      localStorage.setItem("evidence-studio-theme", nextTheme);
    } catch {
      // The theme still changes for this page when storage is unavailable.
    }
    setTheme(nextTheme);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Use ${nextTheme} theme`}
    >
      {nextTheme === "light" ? "Light" : "Dark"}
    </button>
  );
}
