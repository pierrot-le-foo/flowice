import { exec } from "child_process";
import { promisify } from "util";

export async function downloadRepo(repo: string, target: string) {
  const command = `git clone ${repo}`;
  const { stdout } = await promisify(exec)(command, { cwd: target });
  console.log({ stdout });
}