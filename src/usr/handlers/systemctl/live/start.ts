import { Service } from "@/types";
import { exec } from "child_process";
import { promisify } from "util";

export default async function start(service: Service) {
  const command = `systemctl start ${service.options.serviceName}`;
  const { stdout } = await promisify(exec)(command);
}
