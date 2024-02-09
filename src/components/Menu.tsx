"use client";
import StorefrontIcon from "@mui/icons-material/Storefront";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Stack from "@mui/material/Stack";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import { usePathname, useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();

  const goTo = (path: string) => () => {
    router.push(path);
  };

  return (
    <Stack p={1} spacing={2}>
      <IconButton
        onClick={goTo("/marketplace")}
        color={pathname.startsWith("/marketplace") ? "warning" : "inherit"}
      >
        <StorefrontIcon />
      </IconButton>

      <IconButton
        onClick={goTo("/")}
        color={
          !pathname.startsWith("/marketplace") && !pathname.startsWith("/add")
            ? "primary"
            : "inherit"
        }
      >
        <RssFeedIcon />
      </IconButton>

      <IconButton
        onClick={goTo("/add")}
        color={pathname.startsWith("/add") ? "success" : "inherit"}
      >
        <AddIcon />
      </IconButton>

      <IconButton
        onClick={goTo("/logs")}
        color={pathname.startsWith("/logs") ? "success" : "inherit"}
      >
        <ArticleIcon />
      </IconButton>

      <IconButton onClick={goTo("/")}>
        <SettingsIcon />
      </IconButton>
    </Stack>
  );
}
