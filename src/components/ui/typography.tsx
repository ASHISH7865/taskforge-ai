import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ElementType, HTMLAttributes, forwardRef } from "react";

const headingVariants = cva(
  "font-sans scroll-m-20 tracking-tight text-foreground",
  {
    variants: {
      variant: {
        h1: "text-4xl font-extrabold lg:text-5xl",
        h2: "text-3xl font-semibold",
        h3: "text-2xl font-semibold",
        h4: "text-xl font-semibold",
        h5: "text-lg font-semibold",
        h6: "text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "h1",
    },
  }
);

export interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = (as || variant || "h1") as ElementType;
    return (
      <Comp
        className={cn(headingVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";

const textVariants = cva("font-sans text-foreground", {
  variants: {
    variant: {
      default: "leading-7",
      lead: "text-xl leading-7",
      large: "text-lg font-semibold",
      small: "text-sm leading-none",
      subtle: "text-sm text-muted-foreground",
      mono: "font-mono text-sm",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
    weight: "regular",
  },
});

export interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, weight, ...props }, ref) => {
    return (
      <p
        className={cn(textVariants({ variant, weight, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Heading, Text, headingVariants, textVariants };
