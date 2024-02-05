import { readFile, readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "usr/config/handlers");
  const handlerNames = await readdir(dir);

  const handlers = await Promise.all(
    handlerNames.map(async (name) => {
      const manifest = await readFile(
        path.join(dir, name, "manifest.json"),
        "utf-8"
      );
      return JSON.parse(manifest);
    })
  );

  return NextResponse.json(handlers);
}
