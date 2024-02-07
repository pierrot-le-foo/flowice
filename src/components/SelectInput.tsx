import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

interface SelectInputProps {
  input: any;
  value: string;
  onChange(value: string): void;
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[];
  showVariables(): void;
}

export default function SelectInput({ input }: SelectInputProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (input.type.from.command) {
      fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input.type.from.command),
      })
        .then((res) => res.json())
        .then(({ stdout }) => setOptions(stdout.trim().split('\n')));
    }
  }, [])

  return (
    <Stack>
      <Autocomplete
        options={options}
        renderInput={(params) => <TextField {...params} label={input.name} />}
      />
    </Stack>
  );
}
