import Stack from "@mui/material/Stack";
import { Input } from "./Inputs";
import { useEffect, useState } from "react";
import { get } from "lodash";
import Divider from "@mui/material/Divider";

interface GroupInputProps {
  input: any;
  value: any;
  onChange(value: any): void;
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[];
  showVariables(): void;
}

export default function GroupInput({
  input,
  variables,
  showVariables,
  onChange,
  value
}: GroupInputProps) {
  const [values, setValues] = useState(value);

  useEffect(() => {
    onChange(values);
  }, [values]);

  return (
    <Stack spacing={2} divider={<Divider />}>
      {input.type.options.map((option) => (
        <Stack key={option.key}>
          <Input
            input={option}
            value={get(value, option.key)}
            onChange={(value) => {
              setValues((values) => ({
                ...values,
                [option.key]: value,
              }));
            }}
            variables={variables}
            showVariables={showVariables}
          />
        </Stack>
      ))}
    </Stack>
  );
}
