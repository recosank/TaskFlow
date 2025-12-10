export type Task = {
  id: number;
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | null;
};

export type Project = {
  id: number;
  title: string;
  description?: string | null;
};

export type SideProject = {
  id: number;
  title: string;
  description?: string | null;
  tasks?: Array<any>;
  updatedAt?: string;
};

export type User = { id: number; email: string; name?: string } | null;

export type AuthContextType = {
  user: User;
  authReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User) => void;
};

export type Filter = {
  search: string;
  status: string | null;
  priority: string | null;
};

export type CreateTask = {
  id: number;
  projectId: number;
  title: string;
  description?: string | null;
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  status?: string;
};

export type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (project: any) => void;
};
