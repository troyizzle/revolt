import clsx from "clsx"
import React from "react"

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "dark" | "light" | "link"
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, ...props }, ref) {
  const classes = clsx("btn", {
    "btn-primary": props.variant === "primary",
    "btn-secondary": props.variant === "secondary",
    "btn-danger": props.variant === "danger",
    "btn-success": props.variant === "success",
    "btn-warning": props.variant === "warning",
    "btn-info": props.variant === "info",
    "btn-dark": props.variant === "dark",
    "btn-light": props.variant === "light",
    "btn-link": props.variant === "link",
  })

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  )
})
