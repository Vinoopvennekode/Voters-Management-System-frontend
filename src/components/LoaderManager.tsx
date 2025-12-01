// src/components/LoaderManager.tsx
import React, { useState, createContext, useContext } from "react";
import { Spinner } from "react-bootstrap";

// Define the context type
interface LoaderContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with a default value
const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  setLoading: () => {},
});

export const useLoader = () => useContext(LoaderContext);

// Singleton control for external loader calls
export const loader = {
  show: () => {},
  hide: () => {},
};

interface LoaderProviderProps {
  children: any;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  // Assign loader control functions
  loader.show = () => setLoading(true);
  loader.hide = () => setLoading(false);
console.log('loadingloading',loading);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
};
