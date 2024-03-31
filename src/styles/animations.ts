import { keyframes } from "@emotion/react";

export const pulseAnimation = keyframes({
  "0%": {
    boxShadow: "0 0 0 0 rgba(29, 24, 6, 0.4)",
  },
  "70%": {
    boxShadow: "0 0 0 28px rgba(22, 20, 14, 0)",
  },
  "100%": {
    boxShadow: " 0 0 0 0 rgba(204,169,44, 0)",
  },
});


