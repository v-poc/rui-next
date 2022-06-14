import React from 'react';
import { Link } from 'pressify/client';
import { useThemeContext } from '../../context';
import { TextNav, IconNav } from '../Nav';
import { Search } from '../Search';
import { ThemeModeSwitch } from '../ThemeModeSwitch';
import { NavScreen } from '../NavScreen';

function Banner() {
  const { banner } = useThemeContext();
  const finalBanner = typeof banner === 'string' ? [banner] : banner;

  if (!finalBanner) {
    return null;
  }

  return (
    <div className="h-[var(--banner-height)] px-6 md:px-8 bg-c-brand leading-[var(--banner-height)] text-center text-white text-xs font-semibold">
      {finalBanner.map((x, index) =>
        Array.isArray(x)
          ? React.createElement(x[0], { ...x[1], key: index }, x[2])
          : x
      )}
    </div>
  );
}

export const Header: React.FC = () => {
  const { logo, title, homePath = '' } = useThemeContext();

  return (
    <div className="sticky top-0 w-full z-[var(--z-index-header)]">
      <Banner />
      <header className="h-[var(--header-height)] border-b border-b-c-border-1 bg-c-bg-0">
        <div className="h-full max-w-8xl mx-auto px-6 md:px-8 flex items-center">
          <Link
            className="h-full flex items-center space-x-2 hover:opacity-80 transition-opacity"
            to={homePath}
          >
            {logo && <img className="w-6" src={logo} alt="logo" />}
            {title && (
              <h1 className="text-lg font-medium tracking-wide text-c-text-0">
                {title}
              </h1>
            )}
          </Link>
          <div className="h-full hidden md:block">
            <Search />
          </div>
          <div className="h-full ml-auto -mr-2 hidden md:flex items-center">
            <TextNav />
            <ThemeModeSwitch className="ml-4 pl-4 mr-2 border-l border-c-border-1" />
            <IconNav size="small" />
          </div>
          <div className="h-full ml-auto -mr-4 flex md:hidden items-center">
            <Search iconOnly />
            <NavScreen />
          </div>
        </div>
      </header>
    </div>
  );
};
