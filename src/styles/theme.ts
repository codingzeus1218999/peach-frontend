import { PaletteColorOptions, createTheme } from "@mui/material";

const fallbackFonts = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

// Use the system fonts as a fallback if IBM Plex Sans is not available
const IBMPlexSansFonts = ['"IBM Plex Sans"', ...fallbackFonts].join(",");
const PatronFonts = ['"Patron Bold"', '"IBM Plex Sans"', ...fallbackFonts].join(
  ",",
);

declare module "@mui/material" {
  interface KeyValueColor {
    [key: string]: React.CSSProperties["color"];
  }
  interface CustomPalette {
    whiteBg: PaletteColorOptions;
    green: KeyValueColor;
    black: KeyValueColor;
    pink: KeyValueColor;
    yellow: KeyValueColor;
    blue: KeyValueColor;
    contrast: {
      primary: React.CSSProperties["color"];
      secondary: React.CSSProperties["color"];
      error: React.CSSProperties["color"];
      info: React.CSSProperties["color"];
    };
    hoverBg: {
      [key: string]: {
        contained: React.CSSProperties["color"];
        outlined: {
          default: React.CSSProperties["color"];
          resting: React.CSSProperties["color"];
        };
      };
    };
  }

  interface PaletteColor {
    content?: React.CSSProperties["color"];
    background?: React.CSSProperties["color"];
  }

  interface SimplePaletteColorOptions {
    content?: React.CSSProperties["color"];
    background?: React.CSSProperties["color"];
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}

  interface TypographyVariants {
    displayLg: React.CSSProperties;
    displayMd: React.CSSProperties;
    displaySm: React.CSSProperties;
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    labelLg: React.CSSProperties;
    labelMd: React.CSSProperties;
    labelSm: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    displayLg?: React.CSSProperties;
    displayMd?: React.CSSProperties;
    displaySm?: React.CSSProperties;
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    labelLg?: React.CSSProperties;
    LabelMd?: React.CSSProperties;
    labelSm?: React.CSSProperties;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    whiteBg: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    displayLg: true;
    displayMd: true;
    displaySm: true;
    body3: true;
    body4: true;
    labelLg: true;
    labelMd: true;
    labelSm: true;
  }
}

const theme = createTheme({
  // TYPOGRAPHY
  typography: {
    fontFamily: IBMPlexSansFonts,
    h1: {
      fontFamily: PatronFonts,
      fontSize: "32px",
      lineHeight: "40px",
      fontWeight: 700,
    },
    h2: {
      fontFamily: PatronFonts,
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: 700,
    },
    h3: {
      fontFamily: PatronFonts,
      fontSize: "20px",
      lineHeight: "28px",
      fontWeight: 700,
    },
    h4: {
      fontSize: "22px",
      fontWeight: 500,
      lineHeight: "28px",
    },
    h5: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "24px",
    },
    h6: {
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: "0.1px",
      lineHeight: "20px",
    },
    body1: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: "28px",
    },
    body2: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "24px",
      letterSpacing: "0.5px",
    },
    body3: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      letterSpacing: "0.25px",
    },
    body4: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "13px",
      fontWeight: 400,
      lineHeight: "16px",
      letterSpacing: "0.4px",
    },
    labelLg: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "20px",
    },
    labelMd: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "16px",
      letterSpacing: "0.15px",
    },
    labelSm: {
      fontFamily: IBMPlexSansFonts,
      fontSize: "11px",
      fontWeight: 400,
      lineHeight: "16px",
      letterSpacing: "0.05px",
    },
    displayLg: {
      fontFamily: PatronFonts,
      fontSize: "88px",
      fontWeight: 700,
      lineHeight: "104px",
      letterSpacing: "-0.25px",
    },
    displayMd: {
      fontFamily: PatronFonts,
      fontSize: "68px",
      fontWeight: 700,
      lineHeight: "76px",
    },
    displaySm: {
      fontFamily: PatronFonts,
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: "56px",
    },
  } as any,

  // OVERRIDES
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          displayLg: "h1",
          displayMd: "h2",
          displaySm: "h3",
          body3: "p",
          body4: "p",
          labelLg: "label",
          labelMd: "label",
          labelSm: "label",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "100em",
          cursor: "pointer",
          boxShadow: "none",
          "&&:hover":{
            boxShadow: "none",
          }
        },
        sizeLarge: {
          fontSize: "15px",
          textTransform: "none",
          letterSpacing: "0.46px",
          fontWeight: "500",
          padding: "10px 26px",
        },
        sizeMedium: {
          fontSize: "14px",
          textTransform: "none",
          letterSpacing: "0.46px",
          fontWeight: "500",
          padding: "8px 16px",
        },
        sizeSmall: {
          fontSize: "13px",
          textTransform: "none",
          letterSpacing: "0.46px",
          fontWeight: "500",
          padding: "4px 12px",
        },
        fullWidth: {
          padding: "12px 0",
        },
        startIcon: {
          marginRight: "12px",
        },
        endIcon: {
          marginLeft: "12px",
        },
        contained: {
          backgroundColor: "#262626",
          "&:hover": {
            backgroundColor: "#262626",
          },
          "&:disabled": {
            backgroundColor: "#E2E2E2",
            color: "#A3A3A3",
          },
        },

        outlined: {
          color: "#262626",
          backgroundColor: "#FFFFFF",
          borderColor: "#888888",
          "&:hover": {
            backgroundColor: "#EBEBEB",
          },
          "&:disabled": {
            backgroundColor: "#FFFFFF",
            borderColor: "#e8e8e8",
            color: "#B7B7B7",
          },
        },
        text: {
          color: "#262626",
          backgroundColor: "none",
          border: "none",
          "&:hover": {
            backgroundColor: "#EBEBEB",
            border: "none",
          },
          "&:disabled": {
            backgroundColor: "#FFFFFF",
            color: "#B7B7B7",
          },
        },
      },
    },
  },

  // PALETTE
  palette: {
    primary: {
      main: "#262626",
      light: "#555555",
      dark: "#000000",
    },
    secondary: {
      main: "#FFFFFF",
      light: "#FAD44F",
      dark: "#F9B200",
    },
    error: {
      main: "#FF9565",
      light: "#FFD3BE",
      dark: "#FF7130",
      content: "#000000",
      background: "#F9F9F9",
    },
    info: {
      main: "#FCD475",
      light: "#64B6F7", //TBC
      dark: "#0B79D0", //TBC
      content: "#000000", //TBC
      background: "#F9F9F9", //TBC
    },
    contrast: {
      primary: "#FFFFFF",
      secondary: "#202123",
      error: "202123",
      info: "#FFFFFF",
    },
    hoverBg: {
      primary: {
        contained: "#262626",
        outlined: {
          default: "#555555",
          resting: "#262626",
        },
      },
      secondary: {
        contained: "#F9C928",
        outlined: {
          default: "#FFFFFF",
          resting: "#F9C007",
        },
      },
      error: {
        contained: "#FFC4A8",
        outlined: {
          default: "#FFE6DA",
          resting: "#FF9565",
        },
      },
      info: {
        contained: "#2196F3", //TBC
        outlined: {
          default: "#edf7fe", //TBC
          resting: "#90caf9", //TBC
        },
      },
    },
    green: {
      50: "#EBFBED",
      100: "#D0F4D3",
      200: "#B1EEB7",
      300: "#91E79A",
      400: "#79E084",
      500: "#63D86E",
      600: "#59C863",
      700: "#4DB456",
      800: "#43A24C",
      900: "#308138",
    },
    black: {
      50: "#F5F5F5",
      100: "#E9E9E9",
      200: "#D9D9D9",
      300: "#C4C4C4",
      400: "#9D9D9D",
      500: "#7B7B7B",
      600: "#555555",
      700: "#434343",
      800: "#262626",
      900: "#000000",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#EEEEEE", //TBC
      400: "#E0E0E0",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#171517",
    },
    pink: {
      50: "#FEEFF1",
      100: "#FED8DB",
      200: "#F3ABAA",
      300: "#F08A87",
      400: "#FF6F66",
      500: "#FF624C",
      600: "#F85B4C",
      700: "#E65145",
      800: "#D94B3E",
      900: "#CA4132",
    },
    yellow: {
      50: "#FDFBE6",
      100: "#FAF3C2",
      200: "#F6EB9B",
      300: "#F6EC9B",
      400: "#F1DF54",
      500: "#EEDA35",
      600: "#ECC831",
      700: "#EAB129",
      800: "#E69A21",
      900: "#E17212",
      1000: "#F9DC8F",

    },
    blue: {
      50: "#DFF7F6",
      100: "#AFEAE7",
      200: "#7CDCD7",
      300: "#48CDC5",
      400: "#16BFB5",
      500: "#00B2A6",
      600: "#00A497",
      700: "#009385",
      800: "#009385",
      900: "#006557",
    },
    whiteBg: {
      main: "#fff",
      contrastText: "#000",
    },
  },

  // transitions
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default theme;

export const withTransientProps = {
  shouldForwardProp: (propName: string) =>
    propName !== "theme" && !propName.startsWith("$"),
};
