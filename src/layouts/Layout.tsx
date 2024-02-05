import Stack from "@mui/material/Stack";
import { ReactNode } from "react";
import Menu from "@/components/Menu";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Stack sx={{ height: "100dvh" }}>
      <Stack direction="row" sx={{ flex: 1 }}>
        <aside>
          <Menu />
        </aside>
        <Stack component="main" style={{ flex: 1 }}>{children}</Stack>
      </Stack>
    </Stack>
  );
}
