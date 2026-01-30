import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CommandItem } from "../../app/hooks";
import "./CommandPaletteStyle.css";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  commands: CommandItem[];
};

export default function CommandPalette({
  open,
  onClose,
  onOpen,
  commands,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setQuery("");
        setActiveIndex(0);
        onOpen();
      }
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen, onClose]);

  const filtered = commands
    .filter((c) => c.keywords.includes(query.toLowerCase()))
    .slice(0, 10);

  function onEnter() {
    const item = filtered[activeIndex];
    if (item) {
      item.action();
      onClose();
      setQuery("");
    }
  }

  if (!open) return null;

  const content = (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown")
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
            if (e.key === "Enter") onEnter();
          }}
          placeholder="Search employees, projects..."
        />

        <ul>
          {filtered.map((c, i) => (
            <li
              key={c.id}
              className={i === activeIndex ? "active" : ""}
              onClick={() => {
                c.action();
                onClose();
              }}
            >
              <strong>{c.title}</strong> – {c.subtitle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
