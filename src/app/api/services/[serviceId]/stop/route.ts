import { readFile } from "fs/promises";
import path from "path";
import * as shared from "@/shared";
import { NextResponse } from "next/server";

interface Options {
  params: {
    serviceId: string;
  };
}

const DIR = path.join(process.cwd(), "usr/services");

export async function GET(_request: Request, options: Options) {
  const id = options.params.serviceId;
  const serviceFile = await readFile(path.join(DIR, `${id}.json`), "utf-8");
  const service = JSON.parse(serviceFile);
  const handler = shared[service.handler.key as keyof typeof shared];
  const script = await handler.stop();
  const stop = script.default;
  stop(service);
  return NextResponse.json({ state: 'stopping' });
}
