import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import GitHubInstaller from "./GitHubInstaller";
import { isEmpty } from "lodash";

const installationMethods = [
  {
    label: "GitHub",
    key: "github"
  },
];

interface InstallerProps {
  onInfo(info: any): void;
}

export default function Installer({ onInfo }: InstallerProps) {
  const [installationMethod, setInstallationMethod] = useState(null);
  const [installationInfo, setInstallationInfo] = useState({});

  useEffect(() => {
    if (installationMethod && !isEmpty(installationInfo)) {
      onInfo({ type: installationMethod.key, ...installationInfo });
    }
  }, [installationInfo, installationMethod]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Install</Typography>

      <Autocomplete
        options={installationMethods}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} label="Installation Method" />
        )}
        value={installationMethod}
        onChange={(e, option) => setInstallationMethod(option)}
      />

      {installationMethod && installationMethod.label === "GitHub" && (
        <GitHubInstaller
          onInfo={(info) => setInstallationInfo(info)}
        />
      )}
    </Stack>
  );
}
