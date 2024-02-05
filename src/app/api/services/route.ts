import { HandlerNetwork, ServiceHandler } from "@/types";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import path from "path";

interface Payload {
  type: "existing" | "new";
  name: string;
  description: string;
  handler: ServiceHandler;
  wrapperInputs: Record<string, any>;
  network: HandlerNetwork;
  category: string;
  categoryOptions: Record<string, any>;
  image?: string
}

const DIR = path.join(process.cwd(), "usr/services");

export async function POST(request: Request) {
  const {
    type,
    name,
    description,
    handler,
    wrapperInputs,
    network,
    category,
    categoryOptions,
    image,
  }: Payload = await request.json();
  const id = nanoid(7);
  const service = {
    id,
    name,
    description,
    image,
    network,
    type,
    options: wrapperInputs,
    handler,
    category: {
      type: category,
      options: categoryOptions,
    },
  };
  const filePath = path.join(DIR, `${id}.json`);
  await writeFile(filePath, JSON.stringify(service));
  return NextResponse.json(service);
}

export async function GET() {
  const ids = await readdir(DIR);
  const services = await Promise.all(
    ids.map(async (id) => {
      const service = await readFile(path.join(DIR, id), "utf-8");
      return JSON.parse(service);
    })
  );
  return NextResponse.json(services);
}
