import {
  WrapperInput,
  WrapperInputBoolean,
  WrapperInputText,
  WrapperInputType,
} from "@/types";
import { set, template, templateSettings } from "lodash";

function stringIsValid(
  input: WrapperInput & { type: WrapperInputText },
  value: any
) {
  if (typeof value !== "string") {
    return { valid: false, reason: "Value must be a string" };
  }

  if (!value) {
    return { valid: false, reason: "Value cannot be an empty string" };
  }

  if (input.type.regularExpression) {
    const regex = new RegExp(
      input.type.regularExpression.expression,
      input.type.regularExpression.flags.join("")
    );

    if (!regex.test(value)) {
      return {
        valid: false,
        reason: `Value does not match regular expression: ${regex}`,
      };
    }
  }

  return { valid: true, reason: "" };
}

function booleanIsValid(
  input: WrapperInput & { type: WrapperInputBoolean },
  value: any
) {
  if (typeof value === "boolean") {
    return { valid: true, reason: "" };
  }
  return { valid: false, reason: "Value must be a boolean" };
}

export function isInputValid(
  input: WrapperInput,
  value: any
): { valid: boolean; reason: string } {
  if (input.type.name === "text") {
    if (input.type.list) {
      if (!Array.isArray(value)) {
        return {
          valid: false,
          reason: `Value should be an array`,
        };
      }
      const valids = value.map((v) =>
        stringIsValid(input as WrapperInput & { type: WrapperInputText }, v)
      );

      if (!valids.every((v) => v.valid)) {
        return {
          valid: false,
          reason: valids
            .filter((v) => !v.valid)
            .map((v, i) => `- Entry #${i + 1}: ${v.reason}`)
            .join("\n"),
        };
      }

      return {
        valid: true,
        reason: "",
      };
    }
    return stringIsValid(
      input as WrapperInput & { type: WrapperInputText },
      value
    );
  }
  if (input.type.name === "boolean") {
    if (input.type.list) {
      if (!Array.isArray(value)) {
        return {
          valid: false,
          reason: `Value should be an array`,
        };
      }
      const valids = value.map((v) =>
        booleanIsValid(input as WrapperInput & { type: WrapperInputBoolean }, v)
      );

      if (!valids.every((v) => v.valid)) {
        return {
          valid: false,
          reason: valids
            .filter((v) => !v.valid)
            .map((v, i) => `- Entry #${i + 1}: ${v.reason}`)
            .join("\n"),
        };
      }

      return {
        valid: true,
        reason: "",
      };
    }
    return booleanIsValid(
      input as WrapperInput & { type: WrapperInputBoolean },
      value
    );
  }
  if (input.type.name === "options") {
    return { valid: true, reason: "" };
  }

  return { valid: true, reason: "Unhandled" };
}

export function formatInputs(
  specs: WrapperInput[],
  inputs: Record<string, any>
) {
  const f: Record<string, any> = {};

  for (const input of specs) {
    if (isInputValid(input, inputs[input.key]).valid) {
      f[input.key] = inputs[input.key];
    }
  }

  return f;
}

export function compile(variables: Record<string, any>, from: string) {
  templateSettings.interpolate = /{{([\s\S]+?)}}/g;
  const compiler = template(from);
  let compiled = compiler(variables);
  while (/\{\{.+\}\}/.test(compiled)) {
    compiled = compile(variables, compiled)
  }
  return compiled
}

export function variablesArrayToObject(
  variables: {
    source: string;
    name: string;
    description: string;
    value: any;
    color: string;
  }[]
) {
  const obj: Record<string, any> = {};

  for (const variable of variables) {
    if (!obj[variable.source]) {
      obj[variable.source] = {} as Record<string, any>;
    }
    set(obj[variable.source], variable.name, variable.value);
  }

  return obj;
}

export function compileInputs(
  specs: WrapperInput[],
  inputs: Record<string, any>,
  variables: Record<string, any>
) {
  const compiled: Record<string, any> = {};

  for (const input of specs) {
    const value = inputs[input.key];

    if (typeof value !== "undefined") {
      if (input.type.list) {
        compiled[input.key] = value.map((v) => compile(variables, v));
      } else {
        const parsed = compile(variables, value);
        compiled[input.key] = parsed;
      }
    }
  }

  return compiled;
}

export function getDefaultValue(input: WrapperInputType) {
  if (input.name === "text") {
    return input.default || "";
  }

  if (input.name === "boolean") {
    return input.default || false;
  }

  if (input.name === "integer") {
    return input.default || 0;
  }

  if (input.name === "float") {
    return input.default || 0;
  }
}
