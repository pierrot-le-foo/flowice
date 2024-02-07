import { WrapperInput } from "@/types";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function BooleanInput({
  value = false,
  onChange,
  input,
}: {
  value: boolean;
  onChange(value: boolean): void;
  input: WrapperInput;
}) {
  return (
    <FormControlLabel
      control={
        <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
      }
      label={input.name}
    />
  );
}
