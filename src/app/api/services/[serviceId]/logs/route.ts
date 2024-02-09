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
  const { interactive, limit, since, until } = await request.json();
  const id = options.params.serviceId;
  const serviceFile = await readFile(path.join(process.env.HOME!, '.flowice/services', `${id}.json`), "utf-8");
  const service = JSON.parse(serviceFile);
  const handlerModule = shared[service.handler.key as keyof typeof shared];
  const logs = await handlerModule.logs(service, { interactive, limit, since, until });
  if (interactive) {
    return new Response(logs)
  }
  return NextResponse.json(logs);
}
