import { NextResponse } from "next/server";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { readFile, stat, writeFile } from "fs/promises";
import { promisify } from "util";
import { exec } from "child_process";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  let { data: flowice_handlers, error } = await supabase
    .from("flowice_handlers")
    .select("actions,name,description,key,image,version,wrapper,source");

  if (error) {
    throw error;
  }

  const handlers = await Promise.all(
    flowice_handlers!.map(async (handler) => {
      let installed = false;
      try {
        const j = await readFile(path.join(process.cwd(), "src/handlers", `${handler.key}.json`), 'utf-8')
        const k = JSON.parse(j)
        installed = k.version;
      } catch (e) {}
      return { ...handler, installed };
    })
  );

  return NextResponse.json(handlers);
}

export async function POST(request: Request) {
  const handler = await request.json();
  await writeFile(
    path.join(process.cwd(), "src/handlers", `${handler.key}.json`),
    JSON.stringify(handler)
  );
  if (handler.source.type === "github") {
    const { stdout } = await promisify(exec)(`yarn add ${handler.source.repo}`);
    console.log(stdout);
  }
  await writeFile(path.join(process.cwd(), 'src/shared.ts'), `export * as ${handler.key} from '${handler.source.name}'\n`, { flag: 'a+'})
  return NextResponse.json({ installed: true });
}
