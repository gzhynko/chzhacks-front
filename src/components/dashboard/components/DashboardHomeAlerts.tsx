import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/alert"
import { Terminal } from "lucide-react";
import { Badge } from "@/components/shadcn-ui/badge"
import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { FieldAlert } from "@/model/FieldAlert";

export const DashboardHomeAlerts: React.FC = () => {
  const { alerts } = useAuthenticatedData();


  return (
    <Card className="flex flex-col h-full w-full rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-4"><span>Alerts</span> {alerts.length !== 0 && <Badge variant="destructive">{alerts.length}</Badge>}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-auto items-center">
        {alerts?.map((alert) => (
          <Alert className="bg-destructive/20 border-none">
            <Terminal className="h-5 w-5" />
            <AlertTitle>
              <div className="flex flex-col">
                <p>{alert.alertType}</p>
                <div className="flex flex-row gap-1">
                  <p className="text-xs">Field: </p>
                  <p>{alert.fieldName}</p>
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
