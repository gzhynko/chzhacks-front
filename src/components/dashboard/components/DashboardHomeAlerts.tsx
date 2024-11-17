import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/alert"
import { X } from "lucide-react";
import { Badge } from "@/components/shadcn-ui/badge"
import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { Button } from "@/components/shadcn-ui/button";
import GenericLucideIcon from "@/components/GenericLucideIcon";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface DashboardHomeAlertsProps {
  alertsFilterFieldId: string | null;
  setAlertsFilterFieldId: (fieldId: string | null) => void;
}

export const DashboardHomeAlerts: React.FC<DashboardHomeAlertsProps> = ({alertsFilterFieldId, setAlertsFilterFieldId}) => {
  const { alerts, fields } = useAuthenticatedData();
  const filteredAlerts = alertsFilterFieldId ? alerts?.filter((alert) => alert.fieldId === alertsFilterFieldId) : alerts;
  const currentFilteredFieldName = fields?.features.find((field) => field.properties.fieldId === alertsFilterFieldId)?.properties.fieldName;

  const iconsMap: {[k: string]: keyof typeof dynamicIconImports} = {
    "Drought": "sun",
    "Flooding": "cloud-rain",
    "Precipitation": "cloud-rain",
    "Extreme Hazard": "triangle-alert",
    "Temperature Extremes": "thermometer",
    "Wind Events": "wind",
    "Extreme Weather": "cloud-lightning",
    "Seiche": "waves",
    "Frost/Freeze": "snowflake",
    "Dust Storm": "wind",
    "Lake-Effect Snow": "snowflake",
    "Debris Flow": "triangle-alert",
  }

  return (
    <Card className="flex flex-col h-full w-full rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between h-[24px]">
          <div className="flex flex-row items-center gap-4">
            <span>Alerts</span> {(alerts && alerts.length !== 0) && <Badge variant="destructive">{alerts.length}</Badge>}
          </div>
          {(alertsFilterFieldId && alertsFilterFieldId !== "") &&  (
            <div className="flex flex-row items-center gap-2">
              <p className="font-normal text-xs">Alerts for: <b>{currentFilteredFieldName}</b></p>
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setAlertsFilterFieldId(null)}><X/></Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-auto items-center">
        {filteredAlerts?.map((alert) => (
          <Alert className="bg-destructive/20 border-none [&>svg~*]:pl-8">
            <GenericLucideIcon name={iconsMap[alert.alertType]} />
            <AlertTitle className="mb-2">
              <div className="flex flex-col gap-0.5">
                <p>{alert.alertType}</p>
                <div className="flex flex-row gap-1">
                  <p className="text-xs">Field: <b>{alert.fieldName}</b></p>
                </div>
              </div>
            </AlertTitle>
            <AlertDescription>
              Expected in {alert.inDays} days.
            </AlertDescription>
          </Alert>
        ))}
        {alerts?.length === 0 && (
          <p className="text-gray-500">No alerts right now.</p>
        )}
      </CardContent>
    </Card>
  );
}
