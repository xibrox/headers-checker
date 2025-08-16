import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const url = searchParams.get("url");
  const userAgent = searchParams.get("userAgent") || "";
  const referer = searchParams.get("referer") || "";
  const origin = searchParams.get("origin") || "";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...(userAgent && { "User-Agent": userAgent }),
        ...(referer && { Referer: referer }),
        ...(origin && { Origin: origin }),
      },
    });

    // Clone the response body (ArrayBuffer for binary, works with text/html/json)
    const body = await response.arrayBuffer();

    // Forward headers, but avoid forbidden ones
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*"); // allow browser access

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
