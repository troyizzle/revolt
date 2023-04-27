import clsx from "clsx";
import React from "react";

type SelectProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement> & {
    label?: string
    options: { label: string, value: string | number }[]
  }

  export const Select = React.forwardRef<HTMLSelectElement, {
  } & SelectProps>((props, ref) => {
    const { label, ...rest } = props;
    const classes = clsx("select select-bordered", {
    })

    return (
      <div className="form-control w-full">
        {props.label &&
          <label className="label">
            <span className="label-text">{props.label}</span>
          </label>
        }
        <select
          className={classes}
          {...rest}
          ref={ref}
        >
        {props.options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
        </select>
      </div>
    )
  })
