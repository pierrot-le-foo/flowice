import { useSearch } from "@/stores/stores";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export default function Search() {
  const search = useSearch((state) => state);

  return (
    <Stack p={2}>
      <TextField
        label="Search"
        placeholder="Enter search term"
        value={search.value}
        onChange={(e) => search.replace(e.target.value)}
      />
    </Stack>
  );
}
