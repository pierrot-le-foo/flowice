import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useRef, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import TerminalIcon from "@mui/icons-material/Terminal";
import DownloadIcon from "@mui/icons-material/Download";
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";

enum TerminalHelper {
  CLONE_GIT_HUB = "Clone GitHub Repository",
  CREATE_PYTHON_VENV = "Create Python Virtual Env",
  DOCKER_BUILD = "Docker build",
  GET_AND_EXECUTE_BASH = "Get and execute bash script",
  PIP_INSTALL = "Pip Install",
  APT_GET = "apt install",
  NPM_INSTALL = "npm install"
}

enum TerminalType {
  INSTALL = "install",
}

interface HelperProps {
  inList: boolean;
  open?(): void;
  close?(): void;
  save?(text: string): void;
}

interface Props {
  onDone(t: string): void;
}

function Render({
  onDone,
  Component,
}: Props & {
  Component: any;
}) {
  return <Component onDone={onDone} />;
}

function Apply({ send }: { send(): void }) {
  return (
    <InputAdornment position="end">
      <IconButton color="primary" sx={{ alignSelf: "center" }} onClick={send}>
        <CheckIcon />
      </IconButton>
    </InputAdornment>
  );
}

function AvatarIcon({ src }: { src: string }) {
  return <Avatar src={src} sx={{ width: 30, height: 30 }} />;
}

function CloneGitHubRepo({ onDone }: Props) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    const url = value.startsWith("http")
      ? value
      : `https://github.com/${value}`;
    onDone!(`git clone ${url} .`);
  }, [onDone, value]);

  return (
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
      InputProps={{
        endAdornment: <Apply send={send} />,
      }}
    />
  );
}

CloneGitHubRepo.title = TerminalHelper.CLONE_GIT_HUB;
CloneGitHubRepo.icon = <GitHubIcon />;

function CreatePythonVirtualEnv({ onDone }: Props) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    onDone!(`python -m venv ${value}\nsource ${value}/bin/activate`);
  }, [onDone, value]);

  return (
    <TextField
      label="Name"
      placeholder="Virtual env name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={(e) => {
        if (e.code === "Enter") {
          send();
        }
      }}
      InputProps={{
        endAdornment: <Apply send={send} />,
      }}
    />
  );
}

CreatePythonVirtualEnv.title = TerminalHelper.CREATE_PYTHON_VENV;
CreatePythonVirtualEnv.icon = <AvatarIcon src="/python.jpg" />;

function PipInstall({ onDone }: Props) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    onDone(`pip install ${value}`);
  }, [onDone, value]);

  return (
    <TextField
      label="Name"
      placeholder="Package name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={(e) => {
        if (e.code === "Enter") {
          send();
        }
      }}
      InputProps={{
        endAdornment: <Apply send={send} />,
      }}
    />
  );
}

PipInstall.title = TerminalHelper.PIP_INSTALL;
PipInstall.icon = <AvatarIcon src="/python.jpg" />;

function GetAndExecuteBashScript({ onDone }: Props) {
  return <TextField />;
}

GetAndExecuteBashScript.title = TerminalHelper.GET_AND_EXECUTE_BASH;
GetAndExecuteBashScript.icon = <DownloadIcon />;

function DockerBuild({ onDone }: Props) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    onDone(`docker build -t ${value} .`);
  }, [onDone, value]);

  return (
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
      InputProps={{
        endAdornment: <Apply send={send} />,
      }}
    />
  );
}

DockerBuild.title = TerminalHelper.DOCKER_BUILD;
DockerBuild.icon = <AvatarIcon src="/docker.png" />;

function AptInstall({ onDone }: Props) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    onDone!(`pkexec apt-get install ${value}`);
  }, [onDone, value]);

  return (
    <TextField
      label="Package"
      placeholder="Enter package"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={(e) => {
        if (e.code === "Enter") {
          send();
        }
      }}
      InputProps={{
        endAdornment: <Apply send={send} />,
      }}
    />
  );
}

AptInstall.title = TerminalHelper.APT_GET;
AptInstall.icon = <AvatarIcon src="/apt.png" />;

function NpmInstall({ onDone }: Props) {
  const [value, setValue] = useState("");

  const send = useCallback(() => {
    onDone!(`npm install ${value}`);
  }, [onDone, value]);

  return (
    <TextField
      label="Dependencies"
      placeholder="Enter dependencies"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={(e) => {
        if (e.code === "Enter") {
          send();
        }
      }}
      InputProps={{
        endAdornment: <Apply send={send} />,
      }}
    />
  );
}

NpmInstall.title = TerminalHelper.NPM_INSTALL;
NpmInstall.icon = <AvatarIcon src="/npm-2.svg" />

const helpers = [
  AptInstall,
  CloneGitHubRepo,
  CreatePythonVirtualEnv,
  DockerBuild,
  GetAndExecuteBashScript,
  NpmInstall,
  PipInstall,
];

export default function Terminal({
  onChange,
}: {
  onChange(str: string): void;
}) {
  const ref = useRef<any>();
  const [openMenu, setOpenMenu] = useState(false);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(-1);
  const onDone = (text: string) => {
    setValue((value) => `${value}${text}\n`);
    setSelected(-1);
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
          {helpers.map((Helper, index) => (
            <ListItemText key={index}>
              <ListItemButton
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  setSelected(index);
                  setOpenMenu(false);
                }}
              >
                <ListItemIcon>{Helper.icon}</ListItemIcon>
                <ListItemText primary={Helper.title} />
              </ListItemButton>
            </ListItemText>
          ))}
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

      {selected > -1 && (
        <Stack>
          <ListItem>
            <ListItemIcon>{helpers[selected].icon}</ListItemIcon>
            <ListItemText primary={helpers[selected].title} />
          </ListItem>

          <Stack direction="row" spacing={1}>
            <Stack sx={{ flex: 1 }}>
              <Render onDone={onDone} Component={helpers[selected]} />
            </Stack>
            <IconButton
              color="warning"
              sx={{ alignSelf: "center" }}
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
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
