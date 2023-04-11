import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
//import AnimatedLogo from "./AnimatedLogo";

const sizes = {
  lg: "py-5 px-6 text-lg",
  md: "py-3 px-4 text-base",
  sm: "py-2 px-4 text-sm",
  xs: "p-0",
};

const iconSized = {
  lg: "p-3",
  md: "p-2",
  sm: "p-1",
  xs: "p-0",
};

const colors = {
  black: {
    solid: "text-white bg-black hover:bg-neutral-900 border-transparent",
    outline: "text-black bg-transparent border-current hover:text-neutral-900",
    ghost:
      "text-black bg-transparent border-transparent hover:text-neutral-900",
  },
  red: {
    solid: "text-white bg-red hover:bg-red-hover border-transparent",
    outline: "text-red bg-transparent  border-current hover:text-red-hover",
    ghost: "text-red bg-transparent border-transparent hover:text-red-hover",
  },
  green: {
    solid: "text-white bg-green hover:bg-green-hover border-transparent",
    outline: "text-green bg-transparent border-current hover:text-green-hover",
    ghost:
      "text-green bg-transparent border-transparent hover:text-green-hover",
  },
  transparent: {
    solid:
      "text-gray hover:text-black hover:bg-light-gray bg-transparent border-transparent rounded-md",
    outline: "text-gray hover:text-black bg-transparent border-current",
    ghost: "text-gray hover:text-black bg-transparent border-transparent",
  },
};

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: keyof typeof sizes;
  color?: keyof typeof colors;
  variant?: "solid" | "outline" | "ghost";
  icon?: ReactNode;
  iconAfter?: boolean;
  loading?: boolean;
}

const Button: React.FC<Props> = ({
  children,
  size = "md",
  color = "black",
  variant = "solid",
  className = "",
  loading = false,
  icon,
  iconAfter,
  disabled,
  ...props
}) => {
  return (
    <button
      aria-label={children as string}
      className={`rounded-full flex items-center justify-center cursor-pointer gap-2 self-center transition-colors border border-solid
         ${disabled ? "cursor-not-allowed opacity-40" : ""}
         ${children ? sizes[size] : iconSized[size]}
         ${colors[color][variant]}
         ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {loading || icon ? (
        <span className={iconAfter ? "order-2" : ""}>
          {/* {loading ? <AnimatedLogo size={24} /> : icon} */}
         icon
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;