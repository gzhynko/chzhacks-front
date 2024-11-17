import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Alert } from "@/components/shadcn-ui/alert";
import { ChevronRight, Plus, Wheat, X } from "lucide-react";
import { Badge } from "@/components/shadcn-ui/badge";
import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { format } from "date-fns";
import { Button } from "@/components/shadcn-ui/button";
import { NavLink } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover";
import { useState } from "react";
import { DashboardTodoItem } from "@/components/dashboard/components/DashboardTodoItem";
import { FarmFieldProperties } from "@/model/FarmField";
import { apiService } from "@/service/api";
import { Feature, Polygon } from "geojson";
import { TodoListItem } from "@/model/TodoListItem";
import { DashboardHomeFieldItem } from "@/components/dashboard/components/DashboardHomeFieldItem";

interface DashboardHomeFieldsProps {
  onAlertClick: (fieldId: string) => void;
}

export const DashboardHomeFields: React.FC<DashboardHomeFieldsProps> = ({onAlertClick}) => {
  const { token, fields } = useAuthenticatedData();

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
        {fields && fields.features.map((field) => (<DashboardHomeFieldItem field={field} onAlertClick={onAlertClick} />))}
      </CardContent>
    </Card>
  );
}
