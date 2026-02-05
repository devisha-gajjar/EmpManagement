import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  defaultOpen?: boolean;
  rightSlot?: ReactNode;
  children: ReactNode;
}

const CollapsibleSection = ({
  title,
  defaultOpen = true,
  rightSlot,
  children,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`card p-3 collapsible ${open ? "open" : ""}`}>
      <div className="collapsible-header" onClick={() => setOpen((v) => !v)}>
        <h4 className="collapsible-card-title">{title}</h4>

        <div className="collapsible-actions">
          {rightSlot}
          <span className={`chevron ${open ? "up" : "down"}`} />
        </div>
      </div>

      <div className="collapsible-body">{children}</div>
    </section>
  );
};

export default CollapsibleSection;
