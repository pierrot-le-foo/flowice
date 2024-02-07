import { rename } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

interface Options {
  params: {
    serviceId: string;
  };
}

export async function GET(_request: Request, options: Options) {
  const id = options.params.serviceId;
  await rename(
    path.join(process.env.HOME!, `.flowice/services/${id}.tmp.json`),
    path.join(process.env.HOME!, `.flowice/services/${id}.json`)
  );
  return NextResponse.json({ created: true });
}
