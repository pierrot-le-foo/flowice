import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import TerminalIcon from "@mui/icons-material/Terminal";
import DownloadIcon from "@mui/icons-material/Download";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

enum TerminalHelper {
  CLONE_GIT_HUB,
  DOCKER_BUILD,
  GET_AND_EXECUTE_BASH,
}

interface HelperProps {
  inList: boolean;
  open?(): void;
  close?(): void;
  save?(text: string): void;
}

function CloneGitHub({ inList, open, close, save }: HelperProps) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    const url = value.startsWith("http")
      ? value
      : `https://github.com/${value}`;
    save!(`git clone ${url} .`);
    setValue("");
    close!();
  }, [close, save, value]);

  if (inList) {
    return (
      <ListItemButton sx={{ borderRadius: 2 }} onClick={open}>
        <ListItemIcon>
          <GitHubIcon />
        </ListItemIcon>
        <ListItemText primary="Clone from GitHub" />
      </ListItemButton>
    );
  }
  return (
    <Stack>
      <ListItem>
        <ListItemIcon>
          <GitHubIcon />
        </ListItemIcon>
        <ListItemText primary="Clone from GitHub" />
      </ListItem>

      <Stack direction="row" spacing={1}>
        <Stack sx={{ flex: 1 }}>
          <TextField
            label="Repository"
            placeholder="Enter repository path like this: owner/repo"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                send();
              }
            }}
          />
        </Stack>
        <IconButton color="primary" sx={{ alignSelf: "center" }} onClick={send}>
          <CheckIcon />
        </IconButton>
        <IconButton color="warning" onClick={close}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function GetAndExecuteBashScript({
  inList,
  setSelected,
  onEnter,
}: HelperProps) {
  if (inList) {
    return (
      <ListItemButton sx={{ borderRadius: 2 }}>
        <ListItemIcon>
          <DownloadIcon />
        </ListItemIcon>
        <ListItemText primary="Download and execute bash script" />
      </ListItemButton>
    );
  }
}

function DockerBuild({ inList, save, open, close }: HelperProps) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    save!(`docker build -t ${value} .`);
    setValue("");
    close!();
  }, [close, save, value]);

  if (inList) {
    return (
      <ListItemButton sx={{ borderRadius: 2 }} onClick={open}>
        <ListItemIcon>
          <Avatar sx={{ width: 30, height: 30 }} src="/docker.png" />
        </ListItemIcon>
        <ListItemText primary="Build docker" />
      </ListItemButton>
    );
  }
  return (
    <Stack>
      <ListItem>
        <ListItemIcon>
          <Avatar sx={{ width: 30, height: 30 }} src="/docker.png" />
        </ListItemIcon>
        <ListItemText primary="Build docker" />
      </ListItem>

      <Stack direction="row" spacing={1}>
        <Stack sx={{ flex: 1 }}>
          <TextField
            label="Tag name"
            placeholder="Enter tag name for the image"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                send();
              }
            }}
          />
        </Stack>
        <IconButton color="primary" sx={{ alignSelf: "center" }} onClick={send}>
          <CheckIcon />
        </IconButton>
        <IconButton color="warning" onClick={close}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function NodeInstall() {
  return (
    <ListItemButton sx={{ borderRadius: 2 }}>
      <ListItemIcon>
        <Avatar src="/nodejs.jpg" sx={{ width: 30, height: 30 }} />
      </ListItemIcon>
      <ListItemText primary="Node Install (npm, yarn, pnpm)" />
    </ListItemButton>
  );
}

export default function Terminal({
  onChange,
}: {
  onChange(str: string): void;
}) {
  const ref = useRef<any>();
  const [openMenu, setOpenMenu] = useState(false);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<TerminalHelper | null>(null);

  const props = {
    save: (text: string) => {
      setValue((value) => `${value}${text}\n`);
    },
    close: () => setSelected(null),
  };

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <Stack>
      <Menu
        anchorEl={ref.current}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        <List disablePadding>
          <CloneGitHub
            inList
            open={() => {
              setSelected(TerminalHelper.CLONE_GIT_HUB);
              setOpenMenu(false);
            }}
          />
          <DockerBuild
            inList
            open={() => {
              setSelected(TerminalHelper.DOCKER_BUILD);
              setOpenMenu(false);
            }}
          />
          <GetAndExecuteBashScript
            inList
            open={() => {
              setSelected(TerminalHelper.GET_AND_EXECUTE_BASH);
              setOpenMenu(false);
            }}
          />
        </List>
      </Menu>

      <ListItem>
        <ListItemIcon>
          <TerminalIcon />
        </ListItemIcon>
        <ListItemText primary="Terminal" />
        <IconButton ref={ref} onClick={() => setOpenMenu(true)}>
          <ArrowDropDownIcon />
        </IconButton>
      </ListItem>

      {selected === TerminalHelper.CLONE_GIT_HUB && (
        <CloneGitHub inList={false} {...props} />
      )}

      {selected === TerminalHelper.DOCKER_BUILD && (
        <DockerBuild inList={false} {...props} />
      )}

      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        multiline
        minRows={3}
        onKeyUp={(e) => {
          if (e.code === "Enter" && e.ctrlKey) {
            setValue(`${value} \\\n`);
          }
        }}
      />
    </Stack>
  );
}
