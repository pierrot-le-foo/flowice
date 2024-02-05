import { useSelectedLogServiceId, useSelectedServiceId } from "@/stores/stores";
import { Service } from "@/types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useCallback, useEffect, useState } from "react";
import JSONReader from "./JSONReader";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

export default function LogsDialog() {
  const selectedServiceId = useSelectedLogServiceId((state) => state.value);
  const replaceSelectedServiceId = useSelectedLogServiceId(
    (state) => state.replace
  );
  const [service, setService] = useState<Service>();
  const [option, setOption] = useState("last");
  const [lines, setLines] = useState(100);
  const [sinceString, setSinceString] = useState("10 minutes ago");
  const [untilString, setUntilString] = useState("5 minutes ago");
  const [since, setSince] = useState(false);
  const [until, setUntil] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const getService = async () => {
    const res = await fetch(`/api/services/${selectedServiceId}`);
    const data = await res.json();
    setService(data);
  };

  useEffect(() => {
    if (selectedServiceId) {
      // getService();
    }
  }, [selectedServiceId]);

  const showLogs = useCallback(async () => {
    const options: any = {};

    if (option === "last") {
      options.last = lines;
    } else if (option === "first") {
      options.first = lines;
    }

    const res = await fetch(`/api/services/${selectedServiceId}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    const { logs } = await res.json();
    setLogs(typeof logs === "string" ? logs.split("\n") : logs);
  }, [option, selectedServiceId, lines]);

  return (
    <Dialog
      open={Boolean(selectedServiceId)}
      onClose={() => replaceSelectedServiceId("")}
      fullWidth
      TransitionProps={{
        mountOnEnter: true,
      }}
    >
      <DialogTitle>Logs</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Options
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={option}
              onChange={(e) => setOption(e.target.value)}
            >
              <FormControlLabel
                value="first"
                control={<Radio />}
                label="First logs"
              />
              <FormControlLabel
                value="last"
                control={<Radio />}
                label="Last logs"
              />
              <FormControlLabel
                value="range"
                control={<Radio />}
                label="Date range"
              />
            </RadioGroup>
          </FormControl>

          {option === "first" && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>First</Typography>
              <TextField
                sx={{ width: 100 }}
                type="number"
                variant="standard"
                value={lines}
                onChange={(e) => setLines(Number(e.target.value))}
              />
              <Typography>logs</Typography>
            </Stack>
          )}

          {option === "last" && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Last</Typography>
              <TextField
                sx={{ width: 100 }}
                type="number"
                variant="standard"
                value={lines}
                onChange={(e) => setLines(Number(e.target.value))}
              />
              <Typography>logs</Typography>
            </Stack>
          )}

          {option === "range" && (
            <Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Checkbox
                  checked={since}
                  onChange={(e) => setSince(e.target.checked)}
                />
                <Typography>Since</Typography>
                <TextField
                  variant="standard"
                  value={sinceString}
                  onChange={(e) => setSinceString(e.target.value)}
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Checkbox
                  checked={until}
                  onChange={(e) => setUntil(e.target.checked)}
                />
                <Typography>Until</Typography>
                <TextField
                  variant="standard"
                  value={untilString}
                  onChange={(e) => setUntilString(e.target.value)}
                />
              </Stack>
            </Stack>
          )}
        </Stack>

        <Stack spacing={2}>
          {logs.map((log, i) => (
            <Stack key={i}>
              <Typography>{log}</Typography>
            </Stack>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={() => replaceSelectedServiceId("")}>
          Close
        </Button>
        <Button onClick={showLogs}>Get logs</Button>
      </DialogActions>
    </Dialog>
  );
}
