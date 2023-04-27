import clsx from "clsx";
import React from "react";

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
    errorMessage?: string;
    label?: string
  }

export const Input = React.forwardRef<HTMLInputElement, {
} & InputProps>((props, ref) => {
  const {  errorMessage, ...rest } = props;
  const classes = clsx("input input-bordered", {
    "input-error": errorMessage
  })

  return (
    <div className="form-control w-full">
      {props.label &&
        <label className="label">
          <span className="label-text">{props.label}</span>
        </label>
      }
      <input
        className={classes}
        {...rest}
        ref={ref}
      >
      </input>
      {errorMessage &&
        <div>{errorMessage}</div>
      }
    </div>
  )
})
