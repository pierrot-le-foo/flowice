import { Service } from "@/types";
import { exec } from "child_process";
import { promisify } from "util";

export default async function stop(service: Service) {
  const command = `systemctl stop ${service.options.serviceName}`;
  const { stdout } = await promisify(exec)(command);
}
