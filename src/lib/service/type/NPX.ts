// @ts-nocheck
import { ServiceTypeNPX } from "@/types";
import { spawn } from "child_process";


export async function getNPXStart(service: ServiceTypeNPX) {
  const command = `/home/pierrot/.nvm/versions/node/v${service.nodeVersion}/bin/npx ${service.command}`;
  console.log(command)
  const args = command.split(" ");
  const cmd = args.shift();
  spawn(cmd!, args, {
    env: {
      ...process.env,
      PORT: service.port.toString(),
    },
  });
}
