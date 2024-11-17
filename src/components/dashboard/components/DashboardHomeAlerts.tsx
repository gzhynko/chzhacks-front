import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/alert"
import { Terminal } from "lucide-react";
import { Badge } from "@/components/shadcn-ui/badge"

export const DashboardHomeAlerts: React.FC = () => {
  return (
    <Card className="flex flex-col h-full w-full rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-4"><span>Alerts</span> <Badge variant="destructive">1</Badge></CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-auto">
        <Alert className="bg-destructive/20 border-none">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components and dependencies to your app using the cli.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
