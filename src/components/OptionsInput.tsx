import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment, useEffect, useState } from "react";
import Inputs from "./Inputs";
import Paper from "@mui/material/Paper";

interface OptionsInputProps {
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

export default function OptionsInput({
  input,
  value,
  onChange,
  variables,
  showVariables,
}: OptionsInputProps) {
  const [options, setOptions] = useState(Array.isArray(input.type.options) ? input.type.options : [])

  useEffect(() => {
    if (input.type.options.command) {
      fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input.type.options.command),
      })
        .then((res) => res.json())
        .then(({ stdout }) => setOptions(stdout.trim().split('\n')));
    }
  }, [])

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{input.name}</Typography>

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">{input.name}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={input.type.options.find((opt) => "default" in opt)?.key}
          name="radio-buttons-group"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <Fragment key={option.key}>
              <FormControlLabel
                value={option.key}
                control={<Radio />}
                label={option.name}
              />
            </Fragment>
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
