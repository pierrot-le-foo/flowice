import { readFile } from "fs/promises";
import path from "path";
import * as shared from "@/shared";
import { NextResponse } from "next/server";
import { promisify } from "util";
import { exec } from "child_process";

interface Options {
  params: {
    serviceId: string;
  };
}

const DIR = path.join(process.cwd(), "usr/services");

export async function POST(request: Request, options: Options) {
  const id = options.params.serviceId;
  const code = await request.json();
  const lines = code.trim().split("\n");
  const res = await promisify(exec)(lines.join(';'), {
    cwd: path.join(process.env.HOME!, ".flowice", "services", id),
  });
  return NextResponse.json(res);
  // const stdout: {date: Date,message:string}[] = []
}
