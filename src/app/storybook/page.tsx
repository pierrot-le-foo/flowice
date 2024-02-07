"use client";
import AddService from "@/components/AddService";
import DirectoryInput, { Directory } from "@/components/DirectoryInput";
import GitHubInstaller from "@/components/GitHubInstaller";
import Installer from "@/components/Installer";
import Terminal from "@/components/Terminak";
import TextInput from "@/components/TextInput";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useState } from "react";

const items = [
  "Add Service",
  "Directory Input",
  "DirectoryName",
  "GitHub Installer",
  "Installer",
  "Terminal",
  "Text",
];

function TextInputWrapper() {
  const [value, setValue] = useState("");

  return <TextInput input={{}} value={value} onChange={setValue} />;
}

function DirectoryNameWrapper() {
  const [value, setValue] = useState("");

  return <Directory path={value} onClick={() => {}} />;
}

function DirectoryWrapper() {
  const [value, setValue] = useState("/");

  const [event, setEvent] = useState("");
  const [eventValue, setEventValue] = useState();

  return (
    <Stack>
      <DirectoryInput
        input={{}}
        value={value}
        onChange={(directory) => {
          setEvent("onChange");
          setEventValue(directory);
        }}
      />
      <Typography>Event: {event}</Typography>
      <Typography>Event value:</Typography>
      <pre>{JSON.stringify(eventValue, null, 2)}</pre>
    </Stack>
  );
}

function InstallerWrapper() {
  const [value, setValue] = useState("");

  const [event, setEvent] = useState("");
  const [eventValue, setEventValue] = useState();

  return (
    <Stack spacing={2}>
      <Installer
        onInfo={(info) => {
          setEvent("onInfo");
          setEventValue(info);
        }}
      />
      <Typography>Event: {event}</Typography>
      <Typography>Event value:</Typography>
      <pre>{JSON.stringify(eventValue, null, 2)}</pre>
    </Stack>
  );
}

function GitHubInstallerWrapper() {
  const [value, setValue] = useState("");
  const [event, setEvent] = useState("");
  const [eventValue, setEventValue] = useState();

  return (
    <Stack spacing={2}>
      <GitHubInstaller
        onInfo={(repo) => {
          setEvent("onInfo");
          setEventValue(repo);
        }}
      />
      <Typography>Event: {event}</Typography>
      <Typography>Event value:</Typography>
      <pre>{JSON.stringify(eventValue, null, 2)}</pre>
    </Stack>
  );
}

function TerminalWrapper() {
  const [value, setValue] = useState("");
  const [event, setEvent] = useState("");
  const [eventValue, setEventValue] = useState();

  return (
    <Stack spacing={2}>
      <Terminal
        onInfo={(repo) => {
          setEvent("onInfo");
          setEventValue(repo);
        }}
      />
      <Typography>Event: {event}</Typography>
      <Typography>Event value:</Typography>
      <pre>{JSON.stringify(eventValue, null, 2)}</pre>
    </Stack>
  );
}

function AddServiceWrapper() {
  const [value, setValue] = useState("");
  const [event, setEvent] = useState("");
  const [eventValue, setEventValue] = useState();

  return (
    <Stack spacing={2}>
      <AddService
        onInfo={(repo) => {
          setEvent("onInfo");
          setEventValue(repo);
        }}
      />
      <Typography>Event: {event}</Typography>
      <Typography>Event value:</Typography>
      <pre>{JSON.stringify(eventValue, null, 2)}</pre>
    </Stack>
  );
}

export default function Storybook() {
  const [name, setName] = useState("Text");

  return (
    <Stack direction="row">
      <List>
        {items.map((item) => (
          <ListItem key={item}>
            <ListItemButton
              onClick={() => {
                setName(item);
              }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Stack p={4} sx={{ flex: 1 }}>
        {name === "text" && <TextInputWrapper />}
        {name === "directoryName" && <DirectoryNameWrapper />}
        {name === "Directory Input" && <DirectoryWrapper />}
        {name === "installer" && <InstallerWrapper />}
        {name === "GitHub Installer" && <GitHubInstallerWrapper />}
        {name === "Terminal" && <TerminalWrapper />}
        {name === "Add Service" && <AddServiceWrapper />}
      </Stack>
    </Stack>
  );
}
