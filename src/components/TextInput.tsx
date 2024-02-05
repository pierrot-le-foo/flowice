import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

interface TextInputProps {
  input: any;
  value: string;
  onChange(value: string): void;
}

export default function TextInput({ input, value, onChange }: TextInputProps) {
  return (
    <Stack>
      <TextField
        label={input.name}
        placeholder={input.description}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Stack>
  );
}
