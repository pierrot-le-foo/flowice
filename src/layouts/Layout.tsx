import Stack from "@mui/material/Stack";
import { ReactNode } from "react";
import Menu from "@/components/Menu";
import Divider from "@mui/material/Divider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Stack
      direction="row"
      sx={{ flex: 1 }}
      divider={<Divider orientation="vertical" sx={{ bgcolor: "#333" }} />}
    >
      <Stack component="aside" sx={{ height: "100dvh" }}>
        <Menu />
      </Stack>
      <Stack
        component="main"
        style={{ flex: 1, height: "100dvh", overflow: "auto" }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
