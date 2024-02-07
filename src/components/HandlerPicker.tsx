import { ServiceHandler } from "@/types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";

const categories = [
  {
    label: "Database",
    key: "database",
  },
  {
    label: "HTTP Server",
    key: "httpServer",
  },
  {
    label: "Service",
    key: "service",
  },
  {
    label: "Web App",
    key: "webApp",
  },
];

interface HandlerPickerProps {
  onChange(handler: ServiceHandler | null): void;
}

export default function HandlerPicker({ onChange }: HandlerPickerProps) {
  const [handlers, setHandlers] = useState<ServiceHandler[]>([]);

  const getHandlers = useCallback(async () => {
    const res = await fetch("/api/handlers");
    const data = await res.json();
    return data;
  }, []);

  useEffect(() => {
    getHandlers().then(setHandlers);
  }, []);

  return (
    <Autocomplete
      options={handlers}
      renderInput={(params) => (
        <TextField {...params} label="Service Handler" />
      )}
      getOptionLabel={(opt) => opt.name}
      onChange={(e, o) => {
        onChange(o);
      }}
    />
  );
}
