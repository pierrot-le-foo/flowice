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

export async function POST(request: Request, options: Options) {
  const logOptions = await request.json()
  const id = options.params.serviceId;
  const serviceFile = await readFile(path.join(DIR, `${id}.json`), "utf-8");
  const service = JSON.parse(serviceFile);
  const handlerModule = shared[service.handler.key as keyof typeof shared];
  console.log(handlerModule)
  const logs = await handlerModule.logs(service, logOptions);
  return NextResponse.json({ logs });
}
