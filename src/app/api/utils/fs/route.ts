import { readdir, stat } from "fs/promises"
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  const { directory } = await request.json()
  const entries = await readdir(directory);
  const files = await Promise.all(entries.map(async entry => {
    const stats = await stat(path.join(directory, entry))
    return {
      name: entry,
      parent: directory,
      path: path.join(directory, entry),
      type: stats.isDirectory() ? 'directory' : 'file'
    }
  }))
  return NextResponse.json(files)
}