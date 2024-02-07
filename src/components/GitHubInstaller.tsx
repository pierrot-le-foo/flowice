import { repoExists } from "@/lib/github";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import DirectoryInput from "./DirectoryInput";

interface GitHubInstallerProps {
  onInfo(props: { repo: string; target: string }): void;
}

export default function GitHubInstaller({ onInfo }: GitHubInstallerProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [target, setTarget] = useState("");
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkRepo = useCallback(async () => {
    if (owner && repo) {
      setLoading(true);
      const exists = await repoExists(owner, repo);
      setLoading(false);
      setExists(exists);
      setChecked(true);
      // if (exists) {
      //   onInfo(`${owner}/${repo}`)
      // }
    }
  }, [owner, repo]);

  return (
    <Stack spacing={2}>
      <Typography>Install with GitHub</Typography>

      <Stack direction="row">
        <Stack
          direction="row"
          spacing={2}
          divider={<Typography>/</Typography>}
          alignItems="center"
        >
          <TextField
            label="Owner"
            placeholder="Owner name"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            autoFocus
          />
          <TextField
            label="Repository"
            placeholder="Repository name"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </Stack>
        <Button onClick={checkRepo}>Check</Button>
        {!!owner && !!repo && loading && <CircularProgress />}
        {!!owner && !!repo && !loading && !exists && checked && (
          <Alert severity="error">Repo not found</Alert>
        )}
        {!!owner && !!repo && !loading && exists && (
          <Alert severity="success">Repo exists</Alert>
        )}
      </Stack>
      {!!owner && !!repo && !loading && exists && (
        <Stack>
          <Typography>Target destination</Typography>
          <DirectoryInput
            input={{}}
            value="/"
            onChange={(directory) => {
              onInfo({
                repo: `${owner}/${repo}`,
                target: directory,
              });
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}
