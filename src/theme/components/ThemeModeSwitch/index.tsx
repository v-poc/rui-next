import { useThemeContext } from '../../context';
import { Sun, Moon } from '../Icons';
import './style.css';

export interface ThemeModeSwitchProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeModeSwitch({
  showLabel,
  className = '',
}: ThemeModeSwitchProps) {
  const { toggleThemeMode } = useThemeContext();

  const content = (
    <div
      className="relative w-10 h-[22px] border border-c-border-2 rounded-full bg-c-bg-1 cursor-pointer hover:border-c-brand transition-[border-color]"
      onClick={toggleThemeMode}
    >
      <div className="py-theme-mode-switch__circle w-[18px] h-[18px] rounded-full bg-c-bg-0 text-sm absolute top-px left-px transition-transform">
        <Sun className="py-theme-mode-switch__sun absolute top-0.5 left-0.5 text-sm transition-all text-c-text-0" />
        <Moon className="py-theme-mode-switch__moon absolute top-0.5 left-0.5 text-sm transition-all text-c-text-0" />
      </div>
    </div>
  );

  if (showLabel) {
    return (
      <div className={`${className} flex justify-between items-center`}>
        <span className="mr-6 text-xs font-medium text-c-text-1">
          Theme Mode
        </span>
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}
