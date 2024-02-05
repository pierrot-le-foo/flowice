import { Service } from "@/types";
import { exec } from "child_process";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { promisify } from "util";

export async function killServiceByProcessId(service: Service) {
  const pid = await readFile(
    path.join(process.cwd(), "processes", service.id),
    "utf-8"
  );
  console.log({ pid });
  const killed = process.kill(Number(pid), "SIGINT");
  return { pid: Number(pid), killed };
}

export async function killServiceByPortProcessId(service: Service) {
  // const cmd = `lsof -ti:${service.port}`;
  // const { stdout } = await promisify(exec)(cmd);
  // const pid = Number(stdout.trim());
  // const ret = process.kill(pid, "SIGINT");
  // return { pid, ret };
}

export async function log(service: Service, action: string, message: any) {
  const date = new Date();
  const dir = path.join(process.cwd(), "logs", service.id);
  const makeDir = async (dir: string) => {
    try {
      await mkdir(dir);
    } catch (e) {
      if (e instanceof Error && "code" in e && e.code === "EEXIST") {
      } else {
        throw e;
      }
    }
  };
  await makeDir(dir);
  await writeFile(
    path.join(dir, `${action}.json`),
    JSON.stringify(message)
  );
}
