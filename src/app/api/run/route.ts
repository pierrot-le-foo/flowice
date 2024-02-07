import path from "path";
import { NextResponse } from "next/server";
import { promisify } from "util";
import { exec } from "child_process";

export async function POST(request: Request) {
  const code = await request.json();
  const lines = code.trim().split("\n");
  const res = await promisify(exec)(lines.join(';'));
  return NextResponse.json(res);
  // const stdout: {date: Date,message:string}[] = []
}
