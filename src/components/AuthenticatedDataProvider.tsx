import { FarmFieldGeoJSONCollection } from "@/model/FarmField";
import { apiService } from "@/service/api";
import { useAuth0, User } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import { AuthenticatedDataContext } from "./AuthenticatedDataContext";
import { FarmEmployee } from "@/model/FarmEmployee";
import { FieldAlert } from "@/model/FieldAlert";

export interface AuthenticatedContextState {
  token: string;
  user: User;
  fields: FarmFieldGeoJSONCollection;
  employees: FarmEmployee[];
  alerts: FieldAlert[];

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
  const [employees, setEmployees] = useState<FarmEmployee[] | undefined>(undefined);
  const [alerts, setAlerts] = useState<FieldAlert[] | undefined>(undefined);

  const fetchData = useCallback(async (): Promise<void> => {
    const accessToken = await getAccessTokenSilently();
    setToken(accessToken);

    const fields = await apiService.getFields(accessToken);
    setFields(apiService.dtoFieldsToFeatureCollection(fields));

    const alertsByField = await apiService.getAlerts(accessToken);
    let alerts: FieldAlert[] = [];
    for (let i = 0; i < alertsByField.length; i++) {
      const fieldAlerts = alertsByField[i];
      const next7Days = fieldAlerts.labels.map((label, idx) => {
        return [idx + 1, label];
      }).filter((res) => res[1] !== "Normal Weather");

      next7Days.forEach((res) => {
        alerts.push({
          fieldId: fieldAlerts.fieldId,
          fieldName: fields.find((field) => field.properties!.fieldId === fieldAlerts.fieldId)?.properties?.fieldName as string,
          inDays: res[0] as number,
          alertType: res[1] as string,
        });
      });
    }
    setAlerts(alerts);
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
    employees: employees!,
    alerts: alerts!,
    refreshFields: fetchData,
    logOut,
  }

  return (
    <AuthenticatedDataContext.Provider value={value}>
      {children}
    </AuthenticatedDataContext.Provider>
  );
};
