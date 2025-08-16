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

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = await response.text();

    return NextResponse.json({
      url,
      status: response.status,
      headers,
      body: body.slice(0, 2000),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
