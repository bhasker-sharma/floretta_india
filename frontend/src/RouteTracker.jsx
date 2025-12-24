import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "./utils/tracker";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      url: location.pathname
    });
  }, [location.pathname]);

  return null;
};

export default RouteTracker;
