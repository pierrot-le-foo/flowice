"use client";
import AddService from "@/components/AddService";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import CircularProgress from "@mui/material/CircularProgress";

export default function AddPage() {
  const [created, setCreated] = useState(false);
  const [id, setId] = useState(nanoid(7));
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (round === 0) {
      setRound((round) => round + 1);
    } else if (round === 2) {
      console.log({ id, round });
      fetch("/api/services/temp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      }).then(() => setCreated(true));
    }
  }, [id, round]);

  return (
    <Stack p={3} spacing={5}>
      <Typography variant="h3">Add Service</Typography>
      {created && <AddService id={id} />}
      {!created && (
        <Stack spacing={3}>
          <CircularProgress />
          <Typography variant="h5" color="darkgray">
            Creating temporary services
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
