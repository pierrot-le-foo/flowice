export interface ServiceHandler {
  name: string;
  description: string;
  image: string;
  version: string | number;
  key: string;
  wrapper: {
    inputs: WrapperInput[];
  };
  actions: ServiceAction[];
  install: ServiceInstallScript;
}

export type WrapperInputType =
  | WrapperInputText
  | InputList<WrapperInputText>
  | WrapperInputDirectory
  | InputList<WrapperInputDirectory>
  | WrapperInputBoolean
  | InputList<WrapperInputBoolean>;

export interface ServiceInstallScript {
  type: "script";
  script: string;
  makeExecutable?: boolean;
}

export enum ServiceAction {
  START = "start",
  STOP = "stop",
  PAUSE = "pause",
  RESTART = "restart",
}

export interface WrapperInput {
  name: string;
  description: string;
  key: string;
  type: WrapperInputType;
  required: boolean;
}

export interface HandlerNetwork {
  port: {
    fixed: number;
  };
}

export interface WrapperInputText {
  name: "text";
  regularExpression?: {
    expression: string;
    flags: string[];
  };
}

export interface WrapperInputBoolean {
  name: "boolean";
}

export type InputList<T> = T & { list: true };

export interface WrapperInputDirectory {
  name: "directory";
  hasFile?: {
    regularExpression?: {
      expression: string;
      flags: string[];
    };
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  network: {
    port: number;
  };
  handler: ServiceHandler;
  options: Record<string, any>;
  category: ServiceCategory;
}

export interface ServiceCategory {
  label: string;
  key: string;
  protocol?: string;
  port?: string;
  domain?: string;
  secure?: boolean;
}

export interface Live {
  status: boolean | null;
  starting: boolean;
  stopping: boolean;
}

export interface LiveService {
  service: Service;
  live: Live;
}

export type Installation = InstallationGitHub;

export interface InstallationGitHub {
  repository: string;
  target: string;
}
