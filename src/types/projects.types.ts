import { Task } from "./tasks.types";

export type Project = {
  id: string;
  ownerId: string;
  members: string[];
  title: string;
  description?: string;
};
