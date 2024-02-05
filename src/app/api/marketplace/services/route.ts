import { NextResponse } from "next/server";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const DIR = path.join(process.cwd(), "usr/marketplace/services");

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let { data: flowice_services, error } = await supabase
    .from("flowice_services")
    .select('name,description,key,options,image,handler,category,web_site');

  return NextResponse.json(flowice_services);
}
