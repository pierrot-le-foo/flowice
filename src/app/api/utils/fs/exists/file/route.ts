import { stat } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { path, is } = await request.json();
  const stats = await stat(path);
  return NextResponse.json({ exists: stats.isFile() });
}
