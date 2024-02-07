import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

interface OptionsFromInputProps {
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

export default function OptionsFromInput({
  input,
  value,
  onChange,
}: OptionsFromInputProps) {
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
        .then(({ stdout }) => setOptions(stdout.trim().split("\n")));
    }
  }, []);

  return (
    <Stack>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">{input.name}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
