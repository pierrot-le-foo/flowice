import { readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import * as shared from "@/shared";
import { NextResponse } from "next/server";

interface Options {
  params: {
    serviceId: string;
  };
}

const DIR = path.join(process.cwd(), "usr/services");

export async function GET(_request: Request, options: Options) {}

export async function DELETE(_request: Request, options: Options) {
  const id = options.params.serviceId;
  const serviceFile = await readFile(path.join(DIR, `${id}.json`), "utf-8");
  const service = JSON.parse(serviceFile);
  if (service.type === "existing") {
    await unlink(path.join(DIR, `${id}.json`));
    return NextResponse.json({ deleted: true });
  }
}

export async function PUT(request: Request, options: Options) {
  const id = options.params.serviceId;
  const service = await request.json();
  await writeFile(
    path.join(process.env.HOME!, ".flowice/services", `${id}.json`),
    JSON.stringify(service)
  );
  return NextResponse.json({ updated: true });
}
