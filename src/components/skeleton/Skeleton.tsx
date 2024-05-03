import React from "react";
import classnames from "classnames";

const defaultPrefixCls = "r-skeleton";

// SkeletonProps type
export type SkeletonProps = {
  prefixCls?: string;
  className?: string;
  animated?: boolean;
};

// Skeleton FC
export const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { prefixCls, animated, className } = props;

  // container css class
  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-animated`]: animated,
  });

  return <div className={wrapCls}></div>;
};

Skeleton.defaultProps = {
  prefixCls: defaultPrefixCls,
};

// SkeletonTitleProps type
export type SkeletonTitleProps = {
  prefixCls?: string;
  animated?: boolean;
};

// SkeletonTitle FC
export const SkeletonTitle: React.FC<SkeletonTitleProps> = (props) => {
  const { prefixCls, animated } = props;

  return (
    <Skeleton animated={animated} className={`${prefixCls}-title`}></Skeleton>
  );
};

SkeletonTitle.defaultProps = {
  prefixCls: defaultPrefixCls,
};

// SkeletonParagraphProps type
export type SkeletonParagraphProps = {
  prefixCls?: string;
  animated?: boolean;
  lineCount?: number;
};

// SkeletonParagraph FC
export const SkeletonParagraph: React.FC<SkeletonParagraphProps> = (props) => {
  const { prefixCls, animated, lineCount } = props;
  const arr = new Array(lineCount).fill("");

  return (
    <div className={`${prefixCls}-paragraph`}>
      {arr.map((item, idx) => (
        <Skeleton
          key={`skeletonline${idx}`}
          animated={animated}
          className={`${prefixCls}-paragraph-line`}
        ></Skeleton>
      ))}
    </div>
  );
};

SkeletonParagraph.defaultProps = {
  prefixCls: defaultPrefixCls,
  lineCount: 3,
};
