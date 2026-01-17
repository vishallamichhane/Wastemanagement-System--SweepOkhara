import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the page
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
