import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const categories = [
  {
    label: "HTTP Server",
    key: "httpServer",
  },
  {
    label: "Web App",
    key: "webApp",
  },
];

interface CategoryPickerProps {
  onChange(category: { label: string; key: string } | null): void;
}

export default function CategoryPicker({ onChange }: CategoryPickerProps) {
  return (
    <Autocomplete
      options={categories}
      renderInput={(params) => (
        <TextField {...params} label="Service Category" />
      )}
      onChange={(e, o) => {
        onChange(o);
      }}
    />
  );
}
