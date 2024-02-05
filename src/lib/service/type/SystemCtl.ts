import { ServiceTypeSystemCtl } from "@/types";
import { exec } from "child_process";
import { promisify } from "util";

export async function getSystemCtlStatus(service: ServiceTypeSystemCtl) {
  const command = `systemctl is-active ${service.serviceName}`;
  const { stdout } = await promisify(exec)(command);
  return stdout.trim() === "active";
}

export async function startSystemCtl(service: ServiceTypeSystemCtl) {
  const command = `systemctl start ${service.serviceName}`;
  const { stdout } = await promisify(exec)(command);
}

export async function stopSystemCtl(service: ServiceTypeSystemCtl) {
  const command = `systemctl start ${service.serviceName}`;
  const { stdout } = await promisify(exec)(command);
}