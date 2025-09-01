import { type ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

export default function Input({
  id,
  name,
  type = "text",
  ...otherProps
}: InputProps) {
  return (
    <div className="control">
      <label htmlFor={id}>{name}</label>
      <input type={type} id={id} name={name} {...otherProps} />
    </div>
  );
}
