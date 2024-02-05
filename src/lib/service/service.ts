import { Service } from "@/types";
import { exec } from "child_process";
import { promisify } from "util";
import {
  killServiceByPortProcessId,
  killServiceByProcessId,
  log,
} from "../process";

export async function getPortStatus(port: number) {
  const cmd = `lsof -i:${port}`;
  try {
    const { stdout } = await promisify(exec)(cmd);
    const ok = ["LISTEN"];
    console.log(stdout);
    return ok.some((k) => stdout.includes(k));
  } catch (error) {
    return false;
  }
}

export async function stopService(service: Service) {
  try {
    const { pid, killed } = await killServiceByProcessId(service);
    await log(service, "stop", {
      pid,
      method: "killServiceByProcessId",
      killed,
    });
    if (!killed) {
      console.log(`Could not kill service ${service.name} by pid`);
    }
  } catch (error) {
    const { pid, ret } = await killServiceByPortProcessId(service);
    await log(service, "stop", { pid, method: "killServiceByPortProcessId" });
  }
}
