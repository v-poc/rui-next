import React from "react";
import type { ReactNode } from "react";
import classnames from "classnames";
import { Divider } from "../index";

// ChipItem type
type ChipItem = {
  type?: "plain" | "link";
  content?: ReactNode;
};

// LinkItem type
type LinkItem = {
  url?: string;
  text?: string;
};

// FooterProps type
export type FooterProps = {
  prefixCls?: string;
  chips?: ChipItem[];
  content?: string | ReactNode;
  label?: string | ReactNode;
  links?: LinkItem[];
  onClickChip?: (item: ChipItem, i: number) => void;
  onClickLink?: (item: LinkItem, i: number) => void;
};

// Footer FC
export const Footer: React.FC<FooterProps> = (props) => {
  const { prefixCls, chips, content, label, links, onClickChip, onClickLink } =
    props;

  const handleClickChip = (item: ChipItem, i: number) => {
    if (chips && chips.length > 0 && item.type?.toLowerCase() === "link") {
      onClickChip?.(item, i);
    }
  };

  const handleClickLink = (
    item: LinkItem,
    i: number,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (onClickLink) {
      e.preventDefault();
      onClickLink(item, i);
    }
  };

  const chipItemCls = (item: ChipItem) => {
    return classnames(`${prefixCls}-chip`, {
      [`${prefixCls}-chip-link`]: item.type?.toLowerCase() === "link",
    });
  };

  return (
    <div className={prefixCls}>
      {label && (
        <div className={`${prefixCls}-label`}>
          <Divider>{label}</Divider>
        </div>
      )}
      {links && links.length > 0 && (
        <div className={`${prefixCls}-links`}>
          {links.map((item: LinkItem, i: number) => (
            <React.Fragment key={`footerLink${i}`}>
              <a
                rel="noopener noreferrer"
                href={item.url}
                onClick={(e) => handleClickLink(item, i, e)}
              >
                {item.text}
              </a>
              {i !== links.length - 1 && <Divider vertical />}
            </React.Fragment>
          ))}
        </div>
      )}
      {content && <div className={`${prefixCls}-content`}>{content}</div>}
      {chips && chips.length > 0 && (
        <div className={`${prefixCls}-chips`}>
          {chips.map((item: ChipItem, i: number) => (
            <div
              key={`footerChip${i}`}
              className={chipItemCls(item)}
              onClick={() => handleClickChip(item, i)}
            >
              {item.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Footer.defaultProps = {
  prefixCls: "r-footer",
  chips: [],
  content: "",
  label: "",
  links: [],
};
