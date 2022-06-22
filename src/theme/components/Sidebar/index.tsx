import { useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useAppState } from "pressify/client";
import { SidebarItem } from "../../types";
import { Link } from "../Link";
import { TextWithIcon } from "../TextWithIcon";
import { CaretRight, ChevronRight } from "../Icons";

import "./style.css";

export interface SidebarIndicatorProps {
  activeItems: SidebarItem[];
  onOpenChange: (open: boolean) => void;
}

export function SidebarIndicator({
  activeItems,
  onOpenChange,
}: SidebarIndicatorProps) {
  return (
    <div
      className="sticky z-[var(--z-index-sidebar-indicator)] top-[calc(var(--header-height)+var(--banner-height))] w-full h-[var(--sidebar-indicator-height)]
      bg-c-bg-0 border-b border-b-c-border-1
      flex lg:hidden items-center px-6 md:px-8"
    >
      <div
        className="h-full flex items-center text-xs text-c-text-1 font-medium cursor-pointer"
        onClick={() => onOpenChange(true)}
      >
        <CaretRight className="text-lg -ml-[5px] mr-2" />
        {activeItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <TextWithIcon text={item.text} icon={item.icon} space="4px" />
            {index < activeItems.length - 1 && (
              <ChevronRight className="mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItems: SidebarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({
  items,
  activeItems,
  open,
  onOpenChange,
}: SidebarProps) {
  const { pagePath } = useAppState();

  // close sidebar when path is changed
  useEffect(() => {
    onOpenChange(false);
  }, [pagePath, onOpenChange]);

  return (
    <>
      <CSSTransition
        classNames="sidebar-mask"
        in={open}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div
          className="fixed lg:hidden z-[var(--z-index-sidebar-mask)] top-0 left-0 right-0 bottom-0 bg-black/60"
          onClick={() => onOpenChange(false)}
        ></div>
      </CSSTransition>
      <div
        className={`
        fixed z-[var(--z-index-sidebar)] top-0 right-full bottom-0 w-[75vw] max-w-[320px] px-6
        lg:top-[calc(var(--header-height)+var(--banner-height))] lg:right-auto lg:w-[var(--left-aside-width)] lg:px-0
        transition-transform duration-300 pt-8 pb-24 overflow-y-auto bg-c-bg-0 border-r border-c-border-1
        ${open ? "translate-x-full lg:translate-x-0" : ""}`}
      >
        {items.map((item, index) => {
          if (item.items) {
            return (
              <div key={index} className="my-7">
                <h2 className="mb-2 flex items-center text-base font-bold text-c-text-1">
                  <TextWithIcon text={item.text} icon={item.icon} space="8px" />
                </h2>
                <div className="border-l border-l-c-border-1">
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.link}
                      color={false}
                      className={`flex items-center min-h-[34px] px-[1em] -ml-px border-l text-sm hover:text-c-brand transition-colors
                      ${
                        activeItems.includes(subItem)
                          ? "text-c-brand border-c-brand"
                          : "text-c-text-1 border-l-transparent"
                      }`}
                    >
                      <TextWithIcon
                        text={subItem.text}
                        icon={subItem.icon}
                        space="8px"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={index}
              to={item.link}
              color={false}
              className={`flex items-center min-h-[34px] text-sm hover:text-c-brand transition-colors
              ${activeItems.includes(item) ? "text-c-brand" : "text-c-text-1"}`}
            >
              <TextWithIcon text={item.text} icon={item.icon} space="8px" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
