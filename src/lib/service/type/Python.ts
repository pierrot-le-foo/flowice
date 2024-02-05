// @ts-nocheck
import {
  killServiceByPortProcessId,
  killServiceByProcessId,
  log,
} from "@/lib/process";
import { ServiceTypePython, ServiceTypePythonVirtual } from "@/types";
import { spawn } from "child_process";
import { writeFile } from "fs/promises";
import { template, templateSettings } from "lodash";
import path from "path";

export async function startPythonScript(service: ServiceTypePython) {
  if (service.virtual === ServiceTypePythonVirtual.VENV) {
    const { cwd = "/home/pierrot/Dev/python-virtual-envs" } = service;
    templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    const compiled = template(service.command);
    const cmd = compiled(service);
    const args = cmd.split(" ");
    const bin = args.shift();
    const exec = `${service.envName}/bin/${bin}`;
    console.log(exec, ...args);
    const ps = spawn(exec!, args, { cwd });
    if (ps.pid) {
      writeFile(
        path.join(process.cwd(), "processes", `${service.id}`),
        ps.pid?.toString()
      );
    }
    await log(service, 'start', { command: cmd, exec, pid: ps.pid });
  }
}

