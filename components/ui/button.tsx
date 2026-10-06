import { cva, type VariantProps } from "class-variance-authority";

/**
 * The v2 pill. Variants only — no wrapper component, because most of these
 * are anchors (`mailto:`, `#work`, `/projects`) and each call site picks its
 * own element.
 *
 * Hover colours are set explicitly on every variant: the base stylesheet
 * turns every hovered link accent-coloured, which would put lime text on a
 * lime pill.
 */
export const pillVariants = cva(
  [
    "group/arrow inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "transition-[background-color,border-color,color,scale] duration-hover motion-safe:active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        /* "See the work", mobile menu "Get in touch". */
        accent:
          "bg-accent text-accent-foreground font-semibold hover:bg-accent-hover hover:text-accent-foreground",
        /* "Résumé", "All six projects →", "All projects". */
        outline:
          "border border-foreground/14 font-medium hover:border-foreground/40 hover:text-foreground",
        /* Header "Get in touch", detail "Ask me about this one". */
        solid:
          "bg-foreground text-background font-medium hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-4 text-[13.5px]",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-[22px] text-[15px]",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

export type PillVariants = VariantProps<typeof pillVariants>;
