import { Service } from "@/types";
import { exec } from "child_process";
import { promisify } from "util";

export default async function pause(service: Service) {
  const command = `systemctl pause ${service.options.serviceName}`;
  const { stdout } = await promisify(exec)(command);
}
