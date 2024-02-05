import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import SdStorageIcon from "@mui/icons-material/SdStorage";
import IconButton from "@mui/material/IconButton";
import DialogActions from "@mui/material/DialogActions";

interface DirectoryInputProps {
  input: any;
  value: string;
  onChange(value: string): void;
}

export function Directory({
  path,
  onClick,
}: {
  path: string;
  onClick(o: string): void;
}) {
  const bits = path.split("/");
  // bits.pop();
  bits.shift();

  return (
    <Stack
      direction="row"
      divider={<Typography>/</Typography>}
      alignItems="center"
    >
      <IconButton>
        <SdStorageIcon />
      </IconButton>
      {bits.map((b, i) => (
        <Button
          key={i}
          sx={{ textTransform: "none" }}
          onClick={() => {
            const nextPath = [];
            for (let j = 0; j <= i; j++) {
              nextPath.push(bits[j]);
            }
            onClick(["", ...nextPath].join("/"));
          }}
        >
          {b}
        </Button>
      ))}
    </Stack>
  );
}

export default function DirectoryInput({
  input = process.env.HOME,
  value,
  onChange,
}: DirectoryInputProps) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [directory, setDirectory] = useState(value);

  const change = async (directory: string) => {
    setLoading(true);
    console.log({ directory });
    const res = await fetch("/api/utils/fs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ directory }),
    });
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      change(directory);
    }
  }, [directory, open]);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          label={input.name}
          placeholder={input.description}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
        <Button
          onClick={() => {
            setOpen(true);
            // change();
          }}
        >
          Change
        </Button>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {directory && <Directory path={directory} onClick={setDirectory} />}
        </DialogTitle>
        <DialogContent>
          {loading && <CircularProgress />}

          {!loading && (
            <List>
              {entries
                .filter((e) => e.type === "directory")
                .map((entry) => (
                  <ListItem key={entry.name} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setDirectory(entry.path);
                      }}
                    >
                      <ListItemIcon>
                        {entry.type === "directory" && <FolderIcon />}
                        {entry.type === "file" && <InsertDriveFileIcon />}
                      </ListItemIcon>
                      <ListItemText primary={entry.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChange(directory);
              setOpen(false);
            }}
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
