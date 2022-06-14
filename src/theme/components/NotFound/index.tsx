import React from 'react';
import { Callout } from '../Callout';

export const NotFound: React.FC = () => {
  return (
    <Callout type="danger" title="404">
      Page Not Found
    </Callout>
  );
  // return (
  //   <div className="h-full flex justify-center items-center font-semibold">
  //     <div className="pr-6 border-r border-c-border-1 text-3xl">404</div>
  //     <div className="pl-6 text-base">Page Not Found</div>
  //   </div>
  // );
};
