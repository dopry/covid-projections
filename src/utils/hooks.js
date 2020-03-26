import { useLocation } from 'react-router-dom';

export function useIsEmbed() {
  // Check if we're embedded in an iFrame
  const { pathname } = useLocation();
  return pathname === '/embed';
}
