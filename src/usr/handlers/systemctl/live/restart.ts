import { Service } from "@/types";
import { exec } from "child_process";
import { promisify } from "util";

export default async function restart(service: Service) {
  const command = `systemctl restart ${service.options.serviceName}`;
  const { stdout } = await promisify(exec)(command);
}
