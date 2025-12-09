import type { CategoryType } from "@/types/mysetting.ts";
import type { Transaction } from "../types/myregister.ts";
import type { ProfileType, NewPasswordType } from "@/types/accountSettings.ts";

export const putWithAuth = async (
  url: string,
  putData: Transaction | CategoryType | ProfileType | NewPasswordType
) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(`${baseUrl}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(putData),
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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify(putData),
    });
  }

  if (!res.ok)
    throw new Error(`Request failed: ${res.status} - ${res.statusText}`);
  return res.json();
};
