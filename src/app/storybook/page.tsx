"use client";
import DirectoryInput, { Directory } from "@/components/DirectoryInput";
import TextInput from "@/components/TextInput";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useState } from "react";

const items = [
  {
    name: "text",
    value: "",
  },
  {
    name: "directory",
    value: "/home/pierrot/Dev/ai/services",
  },
  {
    name: "directoryName",
    value: "/",
  },
];

export default function Storybook() {
  const [name, setName] = useState("text");
  const [value, setValue] = useState("");

  return (
    <Stack direction="row">
      <List>
        {items.map((item) => (
          <ListItem key={item.name}>
            <ListItemButton
              onClick={() => {
                setValue(item.value);
                setName(item.name);
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Stack p={4}>
        {name === "text" && (
          <TextInput input={{}} value={value} onChange={setValue} />
        )}
        {name === "directoryName" && <Directory path={value} onClick={() => {}} />}
        {name === "directory" && (
          <DirectoryInput input={{}} value={value} onChange={setValue} />
        )}
      </Stack>
    </Stack>
  );
}
