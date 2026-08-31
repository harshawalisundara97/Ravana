import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "icon";

interface CommonProps {
  variant?: Variant;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string; target?: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "secondary", block, children, className } = props;
  const cls = clsx(
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "ghost" && "btn-ghost",
    variant === "icon" && "btn-icon",
    block && "btn-block",
    className
  );

  if ("href" in props && props.href) {
    const { href, target } = props;
    return (
      <Link href={href} target={target} className={cls}>
        {children}
      </Link>
    );
  }

  const { variant: _v, block: _b, children: _c, className: _cl, href: _h, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
