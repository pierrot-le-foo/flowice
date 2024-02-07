import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  const { id } = await request.json();
  await writeFile(
    path.join(process.env.HOME!, ".flowice/services", `${id}.tmp.json`),
    JSON.stringify({
      id,
    })
  );
  await mkdir(path.join(process.env.HOME!, ".flowice/services", id));
  return NextResponse.json({ created: true });
}
