"use client";
import StorefrontIcon from "@mui/icons-material/Storefront";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Stack from "@mui/material/Stack";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();

  const goTo = (path: string) => () => {
    router.push(path);
  };

  return (
    <Stack p={1} spacing={2}>
      <IconButton onClick={goTo("/marketplace")}>
        <StorefrontIcon />
      </IconButton>

      <IconButton onClick={goTo("/")}>
        <RssFeedIcon />
      </IconButton>

      <IconButton>
        <SettingsIcon />
      </IconButton>
    </Stack>
  );
}
