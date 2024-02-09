import { WrapperInput } from "@/types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextInput from "./TextInput";
import { useEffect, useState } from "react";
import TextInputs from "./TextInputs";
import BooleanInput from "./BooleanInput";
import Divider from "@mui/material/Divider";
import OptionsInput from "./OptionsInput";
import { useList } from "@/hooks/templates";
import Button from "@mui/material/Button";
import { compile, getDefaultValue, variablesArrayToObject } from "@/lib/inputs";
import ButtonGroup from "@mui/material/ButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import GroupInput from "./GroupInput";
import SelectInput from "./SelectInput";
import { cond } from "lodash";
import OptionsFromInput from "./OptionsFromInput";

interface InputsProps {
  inputs: WrapperInput[];
  onChange(inputs: Record<string, any>): void;
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[];
  showVariables(): void;
}

export function InputList<T>({
  input,
  value,
  variables,
  showVariables,
  onChange,
}: {
  input: WrapperInput;
  value: T;
  onChange(value: T): void;
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[];
  showVariables(): void;
}) {
  const { items, updateByIndex, push, removeByIndex, moveUp, moveDown } =
    useList<T>();

  useEffect(() => {
    onChange(items)
  }, [items])

  return (
    <Stack>
      <Stack p={3} spacing={2} divider={<Divider orientation="horizontal" />}>
        {items.map((item, index) => (
          <Stack key={index} spacing={2}>
            <Input
              value={item}
              input={{ ...input, type: { ...input.type, list: false } }}
              onChange={(value) => updateByIndex(index, () => value)}
              variables={variables}
              showVariables={showVariables}
              showHeader={false}
            />
            <ButtonGroup>
              <Button disabled={index === 0} onClick={() => moveUp(index)}>
                <KeyboardArrowUpIcon />
              </Button>
              <Button
                disabled={index === items.length - 1}
                onClick={() => moveDown(index)}
              >
                <KeyboardArrowDownIcon />
              </Button>
              <Button onClick={() => removeByIndex(index)}>
                <ClearIcon />
              </Button>
            </ButtonGroup>
          </Stack>
        ))}
      </Stack>
      <Stack>
        <Button onClick={() => push(getDefaultValue(input.type))}>
          Add Row
        </Button>
      </Stack>
      {/* {!isValid.valid && (
        <Typography color="error">{isValid.reason}</Typography>
      )} */}
    </Stack>
  );
}

export function Input<T>({
  input,
  value,
  variables,
  showVariables,
  onChange,
  showHeader = true,
}: {
  input: WrapperInput;
  value: T;
  onChange(value: T): void;
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[];
  showVariables(): void;
  showHeader?: boolean;
}) {
  return (
    <Stack key={input.key} spacing={2}>
      {showHeader && (
        <Typography variant="h5" color={input.required ? "primary" : "inherit"}>
          {input.name}
          {input.required ? "*" : <Typography>(optional)</Typography>}
        </Typography>
      )}

      {showHeader && <Typography>{input.description}</Typography>}

      {"list" in input.type && input.type.list === true && (
        <InputList
          input={input}
          value={value || ""}
          variables={variables}
          showVariables={showVariables}
          onChange={onChange}
        />
      )}

      {(!("list" in input.type) || input.type.list === false) &&
        input.type.name === "text" && (
          <TextInput
            input={input}
            value={value || ""}
            variables={variables}
            showVariables={showVariables}
            onChange={onChange}
          />
        )}

      {(!("list" in input.type) || input.type.list === false) &&
        input.type.name === "boolean" && (
          <BooleanInput input={input} value={value} onChange={onChange} />
        )}

      {(!("list" in input.type) || input.type.list === false) &&
        input.type.name === "options" && (
          <OptionsInput
            input={input}
            value={
              value || input.type.options.find((opt) => "default" in opt)?.key
            }
            onChange={onChange}
            variables={variables}
            showVariables={showVariables}
          />
        )}

      {(!("list" in input.type) || input.type.list === false) &&
        input.type.name === "group" && (
          <GroupInput
            input={input}
            value={value}
            onChange={onChange}
            variables={variables}
            showVariables={showVariables}
          />
        )}

      {(!("list" in input.type) || input.type.list === false) &&
        input.type.name === "select" && (
          <SelectInput
            input={input}
            value={value}
            onChange={onChange}
            variables={variables}
            showVariables={showVariables}
          />
        )}

      {(!("list" in input.type) || input.type.list === false) &&
        input.type.name === "optionsFrom" && (
          <OptionsFromInput
            input={input}
            value={value}
            onChange={onChange}
            variables={variables}
            showVariables={showVariables}
          />
        )}
    </Stack>
  );
}

export default function Inputs({
  inputs,
  onChange,
  variables,
  showVariables,
}: InputsProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    onChange(values);
  }, [values]);

  return (
    <Stack spacing={3} divider={<Divider />}>
      {inputs
        .filter((input) => {
          const obj = variablesArrayToObject(variables);

          if (input["if"]) {
            const condition = compile(obj, `{{ ${input["if"]} }}`) === "true";
            return condition;
          }

          return true;
        })
        .map((input) => (
          <Input
            key={input.key}
            input={input}
            variables={variables}
            showVariables={showVariables}
            value={values[input.key]}
            onChange={(value) =>
              setValues((values) => ({
                ...values,
                [input.key]: value,
              }))
            }
          />
        ))}
    </Stack>
  );
}
