// lib/api-client.ts
import { auth } from "@/auth";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await auth();
  const token = session?.accessToken;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Logika tanggung jawab: Handle jika refresh token juga gagal
    return { error: "Unauthorized" };
  }

  return res.json();
}