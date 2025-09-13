export const deleteWithAuth = async (url: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(`${baseUrl}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
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
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
  }

  if (!res.ok)
    throw new Error(`Request failed: ${res.status} - ${res.statusText}`);
};
