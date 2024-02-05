import {
  useFilterByStatus,
  useFilterByType,
  useHandlers,
} from "@/stores/stores";
import { ServiceHandler } from "@/types";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { includes, map } from "lodash";
import { useEffect, useState } from "react";

const statusColors = {
  Down: "error",
  Paused: "secondary",
  Up: "success",
};

export default function Filters() {
  const selectedFilters = useFilterByStatus((state) => state);
  const statusFilters = ["Down", "Up", "Paused"];
  const selectedTypes = useFilterByType((state) => state);
  const handlers = useHandlers((state) => state.list);

  useEffect(() => {
    if (handlers.length) {
      selectedTypes.push(...map(handlers, "key"));
    }
  }, [handlers]);

  return (
    <Stack p={2} spacing={1}>
      <Stack direction="row" spacing={2} py={2}>
        <Typography variant="h6">Types: </Typography>
        {handlers.map((handler) => (
          <Chip
            key={handler.key}
            label={handler.name}
            avatar={<Avatar src={handler.image} />}
            style={{
              opacity: selectedTypes.list.includes(handler.key) ? 1 : 0.4,
            }}
            onDelete={() => {
              selectedTypes.list.filter((type) => type !== handler.key);
            }}
            onClick={() => {
              if (selectedTypes.list.includes(handler.key)) {
                selectedTypes.filter((type) => type !== handler.key);
              } else {
                selectedTypes.push(handler.key);
              }
            }}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={2} py={2}>
        <Typography variant="h6">Status: </Typography>
        {statusFilters.map((statusFilter) => (
          <Chip
            key={statusFilter}
            label={statusFilter}
            color={
              statusColors[statusFilter as keyof typeof statusColors] as "error"
            }
            style={{
              opacity: selectedFilters.list.includes(statusFilter as "Down")
                ? 1
                : 0.4,
            }}
            onDelete={() => {
              selectedFilters.filter((status) => status !== statusFilter);
            }}
            onClick={() => {
              if (selectedFilters.list.includes(statusFilter as "Down")) {
                selectedFilters.filter((status) => status !== statusFilter);
              } else {
                selectedFilters.push(statusFilter as "Down");
              }
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
