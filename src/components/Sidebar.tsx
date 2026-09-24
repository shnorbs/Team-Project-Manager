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
    <aside className="w-full shrink-0 border-b-2 border-foreground/10 px-3 py-3 sm:px-6 lg:w-56 lg:border-b-0 lg:border-r-2 lg:py-6 lg:pl-6 lg:pr-8">
      <nav className="flex gap-2 lg:block lg:space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.value;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={`block min-w-0 flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors sm:px-4 sm:py-3 sm:text-left sm:text-base lg:w-full ${
                isActive
                  ? "border-b-4 border-accent bg-foreground/15 text-foreground sm:border-b-0 sm:border-l-4"
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
