import { FarmFieldGeoJSONCollection } from "@/model/FarmField";
import { apiService } from "@/service/api";
import { useAuth0, User } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import { AuthenticatedDataContext } from "./AuthenticatedDataContext";

export interface AuthenticatedContextState {
  token: string;
  user: User;
  fields: FarmFieldGeoJSONCollection;

  refreshFields: () => void;
  logOut: () => void;
}

interface AuthenticatedDataProviderProps {
  children: React.ReactNode;
}

export const AuthenticatedDataProvider: React.FC<AuthenticatedDataProviderProps> = ({children}) => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>("");
  const [fields, setFields] = useState<FarmFieldGeoJSONCollection | undefined>(undefined);

  const fetchData = useCallback(async (): Promise<void> => {
    const accessToken = await getAccessTokenSilently();
    setToken(accessToken);

    const fields = await apiService.getFields(accessToken);
    setFields(apiService.dtoFieldsToFeatureCollection(fields));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logOut = () => {
    setFields(undefined);
    setToken("");
    logout();
  }

  const value: AuthenticatedContextState = {
    token: token,
    user: user!,
    fields: fields!,
    refreshFields: fetchData,
    logOut,
  }
  return (
    <AuthenticatedDataContext.Provider value={value}>
      {children}
    </AuthenticatedDataContext.Provider>
  );
};
