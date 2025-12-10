import api from "./axios";

export async function login(email: string, password: string) {
  const resp = await api.post("/auth/login", { email, password });
  return resp.data;
}

export async function refresh() {
  const resp = await api.post("/auth/refresh", {}, { withCredentials: true });
  return resp.data;
}

export async function logout() {
  await api.post("/auth/logout");
}
