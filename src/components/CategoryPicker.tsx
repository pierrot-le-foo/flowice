import { ServiceCategory } from "@/types";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const categories = [
  {
    label: "Database",
    key: "database",
  },
  {
    label: "HTTP Server",
    key: "httpServer",
    protocol: "http",
  },
  {
    label: "Service",
    key: "service",
  },
  {
    label: "Web App",
    key: "webApp",
    protocol: "http",
  },
];

interface CategoryPickerProps {
  onChange(category: ServiceCategory | null): void;
}

export default function CategoryPicker({ onChange }: CategoryPickerProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [protocol, setProtocol] = useState("");
  const [port, setPort] = useState("");
  const [domain, setDomain] = useState("localhost");
  const [secure, setSecure] = useState(false);

  return (
    <Stack spacing={2}>
      <Autocomplete<ServiceCategory>
        options={categories}
        renderInput={(params) => (
          <TextField {...params} label="Service Category" />
        )}
        onChange={(e, o) => {
          onChange(o);
          setSelectedCategory(o);
        }}
      />

      {selectedCategory && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Protocol:</Typography>
          {"protocol" in selectedCategory && (
            <Typography>{selectedCategory.protocol}</Typography>
          )}
          {!("protocol" in selectedCategory) && (
            <TextField
              label="Protocol"
              placeholder="Protocol"
              value={protocol}
              variant="standard"
              onChange={(e) => {
                setProtocol(e.target.value);
                onChange({
                  ...selectedCategory,
                  protocol: e.target.value,
                  secure,
                  domain,
                  port,
                });
              }}
            />
          )}
        </Stack>
      )}

      {selectedCategory && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Secure:</Typography>
          <Checkbox
            checked={
              "secure" in selectedCategory ? selectedCategory.secure : secure
            }
            disabled={"secure" in selectedCategory}
            onChange={(e) => {
              setSecure(e.target.checked);
              onChange({
                ...selectedCategory,
                protocol,
                secure: e.target.checked,
                domain,
                port,
              });
            }}
          />
        </Stack>
      )}

      {selectedCategory && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Domain:</Typography>
          {"domain" in selectedCategory && (
            <Typography>{selectedCategory.domain}</Typography>
          )}
          {!("domain" in selectedCategory) && (
            <TextField
              label="Domain"
              placeholder="Domain"
              value={domain}
              variant="standard"
              onChange={(e) => {
                setDomain(e.target.value);
                onChange({
                  ...selectedCategory,
                  domain: e.target.value,
                  secure,
                  protocol,
                  port,
                });
              }}
            />
          )}
        </Stack>
      )}

      {selectedCategory && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Port:</Typography>
          {"port" in selectedCategory && (
            <Typography>{selectedCategory.port}</Typography>
          )}
          {!("port" in selectedCategory) && (
            <TextField
              label="Port"
              placeholder="Port"
              value={port}
              variant="standard"
              onChange={(e) => {
                setPort(e.target.value);
                onChange({
                  ...selectedCategory,
                  port: e.target.value,
                  secure,
                  protocol,
                  domain,
                });
              }}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
}
