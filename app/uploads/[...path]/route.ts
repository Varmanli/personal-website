import { NextResponse } from "next/server";
import { getContentTypeForPath, readStoredUpload } from "@/lib/uploads";

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { path } = await params;
  const key = path.join("/");

  try {
    const { absolutePath, buffer } = await readStoredUpload(key);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": getContentTypeForPath(absolutePath),
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
  }
}
