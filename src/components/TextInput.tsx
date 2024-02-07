import { compile, isInputValid, variablesArrayToObject } from "@/lib/inputs";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";

interface TextInputProps {
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

export default function TextInput({
  input,
  value,
  onChange,
  variables,
  showVariables,
}: TextInputProps) {
  const [isValid, setIsValid] = useState(isInputValid(input, value));
  const [useVariables, setUseVariables] = useState(false);
  const [tab, setTab] = useState(0);
  const [defaultValue, setDefaultValue] = useState("");

  console.log(input.key, {defaultValue})

  useEffect(() => {
    setIsValid(
      isInputValid(
        input,
        useVariables ? compile(variablesArrayToObject(variables), value) : value
      )
    );
  }, [input, useVariables, value, variables]);

  useEffect(() => {
    if ("default" in input.type) {
      if (input.type.default.command) {
        fetch("/api/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input.type.default.command),
        })
          .then((res) => res.json())
          .then(({ stdout }) => setDefaultValue(stdout.trim()));
      }
    }
  }, []);

  useEffect(() => {
    if (!value) {
      onChange(defaultValue)
    }
  }, [defaultValue, value])

  return (
    <Stack spacing={2}>
      {useVariables && (
        <Tabs value={tab} onChange={(e, t) => setTab(t)}>
          <Tab label="Composer" />
          <Tab label="Preview" />
        </Tabs>
      )}

      {(!useVariables || tab === 0) && (
        <TextField
          label={input.name}
          placeholder={input.description}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!isValid.valid}
          helperText={!isValid.valid && isValid.reason}
        />
      )}

      {useVariables && tab === 1 && (
        <Typography>
          {compile(variablesArrayToObject(variables), value)}
        </Typography>
      )}

      <Stack direction="row" alignItems="center" spacing={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={useVariables}
              onChange={(e) => setUseVariables(e.target.checked)}
            />
          }
          label="Use variables"
        />

        {useVariables && (
          <Button
            variant="contained"
            startIcon={<TuneIcon />}
            onClick={showVariables}
          >
            Variables
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
