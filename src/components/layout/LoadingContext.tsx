import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
  initialState?: boolean;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children, initialState = false }) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  // We can use this to handle global loading states from outside sources
  useEffect(() => {
    // This could be extended to connect to other loading sources
  }, []);

  return <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>{children}</LoadingContext.Provider>;
};

export default LoadingContext;
