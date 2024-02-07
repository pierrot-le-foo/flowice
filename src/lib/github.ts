import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: `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`,
});

export async function repoExists(owner: string, repo: string) {
  const res = await octokit.rest.repos.get({
    owner,
    repo,
  });

  return res.status === 200;
}
