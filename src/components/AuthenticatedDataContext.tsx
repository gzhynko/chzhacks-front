import { createContext, useContext } from "react";
import { AuthenticatedContextState } from "./AuthenticatedDataProvider";

export const AuthenticatedDataContext = createContext<AuthenticatedContextState | null>(null);

export const useAuthenticatedData = (): AuthenticatedContextState => {
  const context = useContext(AuthenticatedDataContext);
  if (context === null) {
    throw new Error("useAuthenticatedData must be used within a AuthenticatedDataProvider");
  }
  return context;
};
