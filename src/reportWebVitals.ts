import { Metric, onCLS, onFCP, onLCP, onINP, onTTFB } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onINP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
