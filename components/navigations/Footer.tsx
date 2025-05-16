import { ThemeSwitcher } from "@/components/theme-switcher";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xl gap-8 py-16">
      <p>
        North Compass
      </p>
      <ThemeSwitcher />
    </footer>
  );
}