import { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";

export default function Provider({children}: {children: ReactNode}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}