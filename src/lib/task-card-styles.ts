import { Task } from "@/types/tasks.types";

export const STATUS_LABELS: Record<Task["status"], string> = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const STATUS_OPTIONS: Task["status"][] = [
  "to-do",
  "in-progress",
  "done",
];

export const STATUS_STYLES: Record<
  Task["status"],
  { badge: string; border: string; selected: string; hover: string }
> = {
  "to-do": {
    badge: "bg-amber-500/80 text-white",
    border: "border-amber-400",
    selected: "bg-amber-500/30",
    hover: "hover:bg-amber-500/30",
  },
  "in-progress": {
    badge: "bg-blue-600/80 text-white",
    border: "border-blue-400",
    selected: "bg-blue-600/30",
    hover: "hover:bg-blue-600/30",
  },
  done: {
    badge: "bg-green-600/80 text-white",
    border: "border-green-400",
    selected: "bg-green-600/30",
    hover: "hover:bg-green-600/30",
  },
};

export const PRIORITY_STYLES: Record<
  Task["priority"],
  {
    gradient: string;
    badge: string;
    outline: string;
    selected: string;
    hover: string;
  }
> = {
  high: {
    gradient: "linear-gradient(to left, #D30029, #A80020, #600013)",
    badge: "bg-red-600/80 text-white",
    outline: "#D30029",
    selected: "bg-red-600/30",
    hover: "hover:bg-red-600/30",
  },
  medium: {
    gradient: "linear-gradient(to left, #EA7600, #D46B00, #844200)",
    badge: "bg-orange-600/80 text-white",
    outline: "#EA7600",
    selected: "bg-orange-600/30",
    hover: "hover:bg-orange-600/30",
  },
  low: {
    gradient: "linear-gradient(to left, #24ECCA, #1AC6A9, #07826D)",
    badge: "bg-teal-600/80 text-white",
    outline: "#24ECCA",
    selected: "bg-teal-600/30",
    hover: "hover:bg-teal-600/30",
  },
};
