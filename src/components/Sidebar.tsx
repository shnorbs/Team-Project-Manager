"use client";

export type Tab = "projects" | "tasks";

const navItems: { label: string; value: Tab }[] = [
  { label: "My Projects", value: "projects" },
  { label: "My Tasks", value: "tasks" },
];

export default function Sidebar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <aside className="w-56 shrink-0 py-6 pl-2 pr-6">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.value;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={`block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                isActive
                  ? "bg-foreground/15 text-foreground"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
