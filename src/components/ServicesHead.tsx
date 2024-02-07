import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AddIcon, FiltersIcon, SearchIcon } from "./Icons";
import {
  useFilterByStatus,
  useFilterByType,
  useHandlers,
  useSearch,
  useShowAddDialog,
  useShowFilters,
  useShowSearch,
} from "@/stores/stores";
import Collapse from "@mui/material/Collapse";
import Search from "./Search";
import Filters from "./Filters";
import { useEffect } from "react";
import { map } from "lodash";

export default function ServicesHead() {
  const [toggleSearch, searchIsVisible] = useShowSearch((state) => [
    state.toggle,
    state.value,
  ]);
  const [toggleFilters, filtersAreVisible] = useShowFilters((state) => [
    state.toggle,
    state.value,
  ]);
  const toggleAddDialog = useShowAddDialog((state) => state.toggle);
  const resetSearch = useSearch((state) => state.replace);
  const resetStatusFilters = useFilterByStatus((state) => state.replace);
  const resetTypesFilters = useFilterByType((state) => state.replace);
  const handlers = useHandlers((state) => state.list);

  useEffect(() => {
    if (!searchIsVisible) {
      resetSearch("");
    }
  }, [searchIsVisible]);

  useEffect(() => {
    if (!filtersAreVisible) {
      resetStatusFilters(["Down", "Up", "Paused"]);
      resetTypesFilters(map(handlers, "key"));
    }
  }, [filtersAreVisible]);

  return (
    <TableHead>
      <TableRow>
        <TableCell style={{ width: 60 }}></TableCell>
        <TableCell>Service</TableCell>
        <TableCell style={{ width: 200 }}>Type</TableCell>
        <TableCell style={{ width: 150 }}>Category</TableCell>
        <TableCell align="right" style={{ width: 260 }}>
          <IconButton onClick={toggleSearch}>
            <SearchIcon />
          </IconButton>

          <IconButton onClick={toggleFilters}>
            <FiltersIcon />
          </IconButton>

          <IconButton onClick={toggleAddDialog}>
            <AddIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={10} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={searchIsVisible}>
            <Search />
          </Collapse>
          <Collapse in={filtersAreVisible}>
            <Filters />
          </Collapse>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
