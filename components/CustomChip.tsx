import { extendVariants, Chip as HeroUIChip } from "@heroui/react";

export const CustomChip = extendVariants(HeroUIChip, {
  variants: {
    variant: {
      flat: {}, // Register flat variant
    },
    color: {
      primary: {}, // Register primary color
      secondary: {}, // Register secondary color
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
