import { Theme as MUITheme } from "@mui/material";
declare module "@emotion/react" {
  export interface Theme extends MUITheme {}
}
