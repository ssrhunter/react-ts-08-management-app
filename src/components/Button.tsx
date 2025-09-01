import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type AnchorProps = {
  to: string;
  textOnly?: boolean;
  children: ReactNode;
} & LinkProps;

type ButtonProps = {
  to?: never;
  textOnly?: boolean;
  children: ReactNode;
} & ComponentPropsWithoutRef<"button">;

// "is AnchorProps" guarantees that the props are of type AnchorProps
// and can be spread onto the Link component if props passes the "'to' in props" test.
function isLink(props: AnchorProps | ButtonProps): props is AnchorProps {
  return "to" in props;
}

export default function Button(props: AnchorProps | ButtonProps) {
  const classText = `button ${props.textOnly ? "button--text-only" : ""}`;

  // check for 'to' prop if the 'to prop is present, render a link, otherwise render a button.
  if (isLink(props)) {
    const { children, textOnly, ...rest } = props;
    // render Link component.
    return (
      <Link className={classText} {...rest}>
        {props.children}
      </Link>
    );
  }

  const { children, textOnly, type, ...rest } = props;
  return (
    <button className={classText} {...rest}>
      {children}
    </button>
  );
}
