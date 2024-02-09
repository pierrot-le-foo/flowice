import { useSearch, useShowSearch } from "@/stores/stores";
import { Clear } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";

export default function Search() {
  const search = useSearch((state) => state);
  const showSearch = useShowSearch((state) => state.on);
  const hideSearch = useShowSearch((state) => state.off);
  const params = useSearchParams();

  useEffect(() => {
    if (params.has("search")) {
      search.replace(params.get("search")!);
      showSearch();
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (search.value.length) {
      urlParams.set("search", search.value);
    } else if (urlParams.has("search")) {
      urlParams.delete("search");
    }
    const path = window.location.href.split("?")[0];
    const newURL = `${path}?${urlParams}`;
    history.pushState({}, "", newURL);
  }, [search.value]);

  return (
    <Stack p={2}>
      <TextField
        label="Search"
        placeholder="Enter search term"
        value={search.value}
        onChange={(e) => {
          search.replace(e.target.value);
        }}
        name="flowice-search"
        id="search-flowice"
        onKeyUp={(e) => {
          if (e.code === "Escape") {
            search.replace("");
            hideSearch();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={!search.value.length}
                color="info"
                onClick={() => {
                  search.replace("");
                }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
