import { extendVariants, Button as HeroUIButton } from "@heroui/react";

export const CustomButton = extendVariants(HeroUIButton, {
  variants: {
    variant: {
      flat: null, // Register flat variant
    },
    color: {
      primary: null, // Register primary color
      secondary: null, // Also commonly used in your app
    },
  },
  compoundVariants: [
    {
      variant: "flat",
      color: "primary",
      class: "text-primary",
    },
    {
      variant: "flat",
      color: "secondary",
      class: "text-secondary",
    },
  ],
});
