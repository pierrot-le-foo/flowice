import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import IconButton from "@mui/material/IconButton";
import ScheduleIcon from '@mui/icons-material/Schedule';

interface LogsProps {
  serviceId: string;
}

export default function Logs({ serviceId }: LogsProps) {
  const [interactive, setInteractive] = useState(false);
  const [limit, setLimit] = useState(50);
  const [since, setSince] = useState<Date | null>(null);
  const [until, setUntil] = useState<Date | null>(null);
  const [logs, setLogs] = useState<{ date: Date; message: string }[]>([]);

  useEffect(() => {
    if (interactive) {
      showLogs();
    }
  }, [interactive]);

  const showLogs = useCallback(async () => {
    const res = await fetch(`/api/services/${serviceId}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interactive,
        limit,
        since,
        until,
      }),
    });
    if (interactive) {
      const data = res.body;
      const reader = data!.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        console.log({ chunkValue });
        // setLogs(logs => [...logs, ])
      }
    } else {
      const data = (await res.json()) as { date: string; message: string }[];
      setLogs(
        data.map((log) => ({
          message: log.message,
          date: new Date(log.date),
        }))
      );
    }
  }, [interactive, limit, serviceId, since, until]);

  useEffect(() => {
    showLogs();
  }, []);

  return (
    <Paper elevation={10} sx={{ margin: 3 }}>
      <TableContainer sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={200}>Date</TableCell>
              <TableCell>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Message</Typography>

                  <Stack direction="row">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={interactive}
                          onChange={(e) => setInteractive(e.target.checked)}
                        />
                      }
                      label="Interactive"
                    />

                    <IconButton>
                      <CalendarMonthIcon />
                    </IconButton>

                    <IconButton>
                      <ScheduleIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {logs
              .filter((log) => !!log.message)
              .map((log, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Typography>
                      {formatDistanceToNow(log.date, { addSuffix: true })}
                    </Typography>
                    <Typography color="darkgray" variant="caption">
                      {format(log.date, "yyyy/MM/dd - HH:mm:ss.SSS")}
                    </Typography>
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
