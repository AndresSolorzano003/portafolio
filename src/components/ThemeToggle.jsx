import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      data-cursor="hover"
      aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink ${className}`}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
