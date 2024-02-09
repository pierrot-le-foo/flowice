import { readFile } from "fs/promises";
import path from "path";
import * as shared from "@/shared";
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { get } from "lodash";

interface Options {
  params: {
    serviceId: string;
  };
}

const DIR = path.join(process.cwd(), "usr/services");

export async function GET(_request: Request, options: Options) {
  const id = options.params.serviceId;
  const serviceFile = await readFile(path.join(process.env.HOME!, `.flowice/services/${id}.json`), "utf-8");
  const service = JSON.parse(serviceFile);
  const protocol = get(service, 'category.protocol', 'http')
  const domain = get(service, 'category.domain', 'localhost')
  const port = get(service, 'category.port', 80)
  const url = `${protocol||'http'}://${domain}:${port}`
  console.log(`xdg-open ${url}`)
  exec(`xdg-open ${url}`)
  return NextResponse.json({ starting: true });
}
