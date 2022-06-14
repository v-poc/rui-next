import { useLocation } from 'pressify/client';

export function useActiveMatch({
  link,
  activeMatch,
}: {
  link?: string;
  activeMatch?: string;
}) {
  const { pathname } = useLocation();

  if (!link) {
    return false;
  }

  if (activeMatch) {
    return new RegExp(activeMatch).test(pathname);
  }

  const remainPath = pathname.substring(link.length);

  return (
    pathname.startsWith(link) && (!remainPath || remainPath.startsWith('/'))
  );
}
