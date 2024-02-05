import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface HttpServerProps {
  onChange(props: any): void;
}

export default function HttpServer({ onChange }: HttpServerProps) {
  const [port, setPort] = useState("");

  return (
    <Stack spacing={2}>
      <Typography variant="h5">HTTP Server</Typography>
      <TextField
        label="Port"
        placeholder="Port number"
        value={port}
        onChange={(e) => setPort(e.target.value)}
      />
      <Button
        onClick={() => {
          onChange({ port });
        }}
        variant="contained"
      >
        Done
      </Button>
    </Stack>
  );
}
