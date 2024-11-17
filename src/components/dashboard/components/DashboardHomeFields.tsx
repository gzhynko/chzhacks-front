import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Alert } from "@/components/shadcn-ui/alert";
import { Plus, Wheat } from "lucide-react";
import { Badge } from "@/components/shadcn-ui/badge";
import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { format } from "date-fns";
import { Button } from "@/components/shadcn-ui/button";
import { NavLink } from "react-router-dom";

interface DashboardHomeFieldsProps {
  onAlertClick: (fieldId: string) => void;
}

export const DashboardHomeFields: React.FC<DashboardHomeFieldsProps> = ({onAlertClick}) => {
  const { fields } = useAuthenticatedData();

  return (
    <Card className="flex flex-col h-full w-full rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-4"><span>Fields</span></CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-auto">
        {(!fields || fields.features.length === 0) && (
          <NavLink to="manage" className="w-full h-16">
            <Button variant="ghost" className="text-gray-500 h-16 w-full"><Plus/> Add a new field</Button>
          </NavLink>
        )}
        {fields && fields.features.map((field) => (
          <Alert key={field.id} className="cursor-pointer" onClick={() => onAlertClick(field.properties.fieldId)}>
            <div className="flex flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-3 items-center">
                  <p className="text-lg font-bold overflow-hidden text-ellipsis max-w-[150px]">{field.properties.fieldName}</p>
                  <Badge variant="outline"><div className="flex flex-row gap-1"><Wheat size={16}/><span>{field.properties.cropType}</span></div></Badge>
                </div>
                
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-sm">{field.properties.fieldSize} ga</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500">Planted</p>
                    <p className="text-sm">{format(field.properties.cropPlanted, "MM.dd.yyyy")}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500">Harvest</p>
                    <p className="text-sm">{format(field.properties.cropHarvest, "MM.dd.yyyy")}</p>
                  </div>
                </div>
              </div>
              <Badge variant="destructive">1 alert(s)</Badge>
            </div>
          </Alert>
          ))}
      </CardContent>
    </Card>
  );
}
