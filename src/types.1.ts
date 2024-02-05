export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  category: ServiceCategory;
  port: number;
}

export enum ServiceType {
  DOCKER_COMPOSE = "docker-compose",
  NPX = "npx",
  PYTHON = "python",
  SYSTEMCTL = "systemctl",
  COMMAND = "command",
}

export enum ServiceCategory {
  WEB_APP = "web app",
  DATABASE = "database",
  HTTP = "http server",
}

export interface ServiceTypeDockerCompose extends Service {
  type: ServiceType.DOCKER_COMPOSE;
  services?: string[];
  cwd: string;
}

export interface ServiceTypeNPX extends Service {
  type: ServiceType.NPX;
  command: string;
  port: number;
  nodeVersion: string;
}

export interface ServiceTypeSystemCtl extends Service {
  type: ServiceType.SYSTEMCTL;
  serviceName: string;
}

export enum ServiceTypePythonVirtual {
  VENV = "venv",
  CONDA = "conda",
}

export interface ServiceTypePython extends Service {
  type: ServiceType.PYTHON;
  command: string;
  port: number;
  nodeVersion: string;
  virtual: ServiceTypePythonVirtual;
  cwd?: string;
  envName: string;
}

export interface LiveService {
  id: string;
  service: Service;
  status: boolean | undefined | null;
  starting: boolean;
  stopping: boolean;
}

export interface Template {
  name: string;
  description: string;
  network: {
    port: number;
    host: string;
    secure: boolean;
    protocol: string;
  };
  type: TemplateType;
}

export enum TemplateTypeName {
  DOCKER = "docker",
}

export enum TemplateInstallName {
  GIT = "git",
}

export type TemplateInstall = TemplateInstallGit;

export interface TemplateInstallGit {
  name: TemplateInstallName.GIT;
  repo: string;
  vendor: string;
}

export enum TemplateInstallGitFetchName {
  HTTP = "http",
}

export interface TemplateInstallGitFetchHttp {
  name: TemplateInstallGitFetchName.HTTP;
}

export type TemplateInstallGitFetch = TemplateInstallGitFetchHttp;

export interface TemplateType {
  name: TemplateTypeName;
  install: TemplateInstall;
  fetch: TemplateInstallGitFetch;
}
