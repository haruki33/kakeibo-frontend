import type { Category } from "../types/mysetting.ts";
import type { Transaction } from "../types/myregister.ts";
import type { CurrentPasswordType } from "@/types/accountSettings";

export const postWithAuth = async (
  url: string,
  postData: Category | Transaction | CurrentPasswordType
) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(postData),
    credentials: "include",
  });

  if (res.status === 401) {
    console.warn("Access token expired, refreshing...");
    const refreshRes = await fetch(`${baseUrl}/refresh_access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error(`Failed to refresh token`);
    }

    const data = await refreshRes.json();
    accessToken = data.accessToken;
    localStorage.setItem("accessToken", accessToken ?? "");

    res = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
      credentials: "include",
    });
  }

  if (!res.ok)
    throw new Error(`Request failed: ${res.status} - ${res.statusText}`);
  return res.json();
};
