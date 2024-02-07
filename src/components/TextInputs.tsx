import { useStringList } from "@/hooks/templates";
import { createListStore, createStringListStore } from "@/stores/templates";
import { WrapperInput } from "@/types";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import TextInput from "./TextInput";
import { isInputValid } from "@/lib/inputs";
import Typography from "@mui/material/Typography";

export default function TextInputs({
  values = [""],
  onChange,
  input,
  variables,
  showVariables,
}: {
  values: string[];
  onChange(values: string[]): void;
  input: WrapperInput;
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[];
  showVariables(): void
}) {
  const { items, push, updateByIndex } = useStringList(values);
  const [isValid, setIsValid] = useState(isInputValid(input, values));

  // useEffect(() => {
  //   setIsValid(isInputValid(input, values))
  // }, [input, values])

  useEffect(() => {
    onChange(items)
  }, [items])

  return (
    <Stack>
      <Stack spacing={2}>
        {items.map((value, index) => (
          <Stack key={index}>
            <TextInput
              value={value}
              input={{ ...input, type: { ...input.type, list: false } }}
              onChange={(value) => updateByIndex(index, value)}
              variables={variables}
              showVariables={showVariables}
            />
          </Stack>
        ))}
      </Stack>
      <Stack>
        <Button onClick={() => push("")}>Add Row</Button>
      </Stack>
      {!isValid.valid && <Typography color="error">{isValid.reason}</Typography>}
    </Stack>
  );
}
