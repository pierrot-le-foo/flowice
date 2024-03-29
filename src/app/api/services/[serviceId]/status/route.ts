import { readFile } from "fs/promises";
import path from "path";
import * as shared from "@/shared";
import { NextResponse } from "next/server";

interface Options {
  params: {
    serviceId: string;
  };
}


export async function GET(_request: Request, options: Options) {
  const id = options.params.serviceId;
  const serviceFile = await readFile(path.join(process.env.HOME!, `.flowice/services/${id}.json`), "utf-8");
  const service = JSON.parse(serviceFile);
  const handlerModule = shared[service.handler.key as keyof typeof shared];
  const status = await handlerModule.status(service);
  return NextResponse.json({ status });
}
