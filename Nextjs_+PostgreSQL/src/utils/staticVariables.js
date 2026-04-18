import { Laptop, Moon, Sun } from "lucide-react";

export const themeIcons = {
  light: <Moon className="min-w-[20px] min-h-[20px] size-[20px]" />,
  dark: <Laptop className="min-w-[20px] min-h-[20px] size-[20px]" />,
  system: <Sun className="min-w-[20px] min-h-[20px] size-[20px]" />,
};

export const nextTheme = {
  light: "dark",
  dark: "system",
  system: "light",
};