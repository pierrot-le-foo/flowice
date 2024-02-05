import { Live, LiveService } from "./types";
import { ServiceCategory, ServiceType } from "./types.1";

export const serviceStates = [
  {
    state: "down",
    color: "error",
  },
  {
    state: "paused",
    color: "secondary",
  },
  {
    state: "pausing",
    color: "violet",
  },
  {
    state: "starting",
    color: "salmon",
  },
  {
    state: "stopping",
    color: "warning",
  },
  {
    state: "restarting",
    color: "warning",
  },
  {
    state: "up",
    color: "success",
  },
];

export function getStatusColor(status: boolean | null) {
  if (status === true) {
    return "success";
  }
  if (status === false) {
    return "error";
  }
  return "info";
}
