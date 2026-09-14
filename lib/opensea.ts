const OS_BASE = "https://api.opensea.io/api/v2";

export class OpenSeaError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function osFetch(path: string, init?: RequestInit) {
  const key = process.env.OPENSEA_API_KEY;
  const url = path.startsWith("http") ? path : `${OS_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("accept", "application/json");
  if (key) headers.set("x-api-key", key);

  const res = await fetch(url, {
    ...init,
    headers,
    next: init?.method && init.method !== "GET" ? undefined : { revalidate: 60 },
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const msg =
      typeof json === "object" && json && "errors" in json
        ? JSON.stringify((json as { errors: unknown }).errors)
        : `OpenSea ${res.status}`;
    throw new OpenSeaError(res.status, json, msg);
  }
  return json;
}

export function hasApiKey() {
  return Boolean(process.env.OPENSEA_API_KEY);
}
