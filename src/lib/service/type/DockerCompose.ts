import { Service, ServiceTypeDockerCompose } from "@/types";
import { exec, spawn } from "child_process";
import { filter } from "lodash";
import { promisify } from "util";

export async function getDockerComposeStatus(
  service: ServiceTypeDockerCompose
) {
  const cmd = "docker-compose ps --format json";
  const { stdout } = await promisify(exec)(cmd, { cwd: service.cwd });
  if (!stdout) {
    return false;
  }
  let services = JSON.parse(stdout) as { Service: string; State: string }[];
  if ("services" in service && Array.isArray(service.services)) {
    services = services.filter((s) => service.services?.includes(s.Service));
  }
  const runningServices = filter(services, { State: "running" });
  return (
    runningServices.length > 0 && runningServices.length === services.length
  );
}

export async function startDockerCompose(service: ServiceTypeDockerCompose) {
  const { services = [] } = service;
  const exec = "docker-compose";
  const args = ["up", ...services];
  spawn(exec, args, {
    cwd: service.cwd,
  });
}

export async function stopDockerCompose(service: ServiceTypeDockerCompose) {
  const { services = [] } = service;
  const exec = "docker-compose";
  const args = ["down", ...services];
  spawn(exec, args, {
    cwd: service.cwd,
  });
}
