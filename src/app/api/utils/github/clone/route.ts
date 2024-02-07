import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

export async function POST(request: Request) {
  const { repo, target } = await request.json();

  const command = `git clone https://github.com/${repo}`;
  const { stdout } = await promisify(exec)(command, { cwd: target });
  console.log({ stdout });

  return NextResponse.json({ cloned: true });
}
