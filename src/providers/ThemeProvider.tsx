"use client";
import {
  ThemeProvider as MuiThemeProvider,
  alpha,
  createTheme,
  getContrastRatio,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const violetBase = "#7F00FF";
const violetMain = alpha(violetBase, 0.7);

let theme = createTheme({
  palette: {
    mode: "dark",
    // @ts-ignore
    violet: {
      main: violetMain,
      light: alpha(violetBase, 0.5),
      dark: alpha(violetBase, 0.9),
      contrastText:
        getContrastRatio(violetMain, "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: "#FF5733",
      },
      name: "salmon",
    }),
  },
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div>{children}</div>
    </MuiThemeProvider>
  );
}
