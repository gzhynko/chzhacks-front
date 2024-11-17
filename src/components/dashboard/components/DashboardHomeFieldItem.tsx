import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { DashboardTodoItem } from "@/components/dashboard/components/DashboardTodoItem";
import { Alert } from "@/components/shadcn-ui/alert";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover";
import { FarmFieldProperties } from "@/model/FarmField";
import { TodoListItem } from "@/model/TodoListItem";
import { apiService } from "@/service/api";
import { format } from "date-fns";
import { Feature, Polygon } from "geojson";
import { Wheat, ChevronRight, X, Plus } from "lucide-react";
import { useState } from "react";

interface DashboardHomeFieldItemProps {
  field: Feature<Polygon, FarmFieldProperties>;
  onAlertClick: (fieldId: string) => void;
  alertsFilterFieldId: string | null;
  setAlertsFilterFieldId: (fieldId: string | null) => void;
}

export const DashboardHomeFieldItem: React.FC<DashboardHomeFieldItemProps> = ({ field, onAlertClick, alertsFilterFieldId, setAlertsFilterFieldId }) => {
  const [addingTodoItem, setAddingTodoItem] = useState(false);
  const [newItem, setNewItem] = useState<TodoListItem | null>({text: "", assignedEmployee: null});
  const [open, setOpen] = useState(false);

  const { token, alerts, fields } = useAuthenticatedData();

  const alertsForThisField = alerts?.filter((alert) => alert.fieldId === field.properties.fieldId);

  const updateField = async (fieldId: string, field: Feature<Polygon, FarmFieldProperties>) => {
    await apiService.updateField(token, {
      type: field.type,
      geometry: field.geometry,
      properties: field.properties,
    });
  };

  const updateTodoItem = async (fieldId: string, todoItemIndex: number, todoItem: TodoListItem) => {
    const updatedField = fields.features.find((field) => field.properties.fieldId === fieldId);
    if (updatedField) {
      updatedField.properties.todoList[todoItemIndex] = todoItem;
      await updateField(fieldId, updatedField);
    }
  };

  const addTodoItem = async (fieldId: string, todoItem: TodoListItem) => {
    const updatedField = fields.features.find((field) => field.properties.fieldId === fieldId);
    if (updatedField) {
      if (!updatedField.properties.todoList) {
        updatedField.properties.todoList = [];
      }
      updatedField.properties.todoList.push(todoItem);
      await updateField(fieldId, updatedField);
    }
  }

  return (
    <Popover key={field.id} open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Alert className="cursor-pointer" onClick={() => onAlertClick(field.properties.fieldId)}>
          <div className="flex flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-3 items-center">
                <p className="text-lg font-bold overflow-hidden text-ellipsis max-w-[150px]">{field.properties.fieldName}</p>
                <Badge variant="outline"><div className="flex flex-row gap-1"><Wheat size={16}/><span>{field.properties.cropType}</span></div></Badge>
              </div>
              
              <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="text-sm">{field.properties.areaAcre} ac</p>
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
            {(alertsForThisField && alertsForThisField.length !== 0) && 
              <Badge variant="destructive" onClick={(e) => {setAlertsFilterFieldId(field.properties.fieldId); e.stopPropagation();}}>{alertsForThisField.length} alert(s)</Badge>
            }
          </div>
        </Alert>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-3 w-[400px] max-h-[500px] overflow-hidden">
        <div className="flex flex-col gap-3 h-full overflow-hidden">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-1 items-center">
              <p className="text-lg font-medium leading-none">{field.properties.fieldName}</p>
              <ChevronRight size={14} />
              <p className="text-base">To-do List</p>
            </div>
            <Button variant="ghost" className="p-1 h-fit" onClick={() => {setAddingTodoItem(false); setOpen(false)}}><X/></Button>
          </div>
          <div className="flex flex-col gap-2 overflow-auto h-full">
            {!addingTodoItem ? (
              <Button variant="ghost" className="text-gray-500 h-20 w-full shrink-0" onClick={() => setAddingTodoItem(true)}><Plus/> Add item</Button>
            ) : (
              <DashboardTodoItem todoItem={newItem!} isEditing={true} updateItem={(newItem) => {addTodoItem(field.properties.fieldId, newItem); setAddingTodoItem(false)}} />
            )}
            {field.properties.todoList?.map((item, index) => (<DashboardTodoItem todoItem={item} isEditing={false} updateItem={(newItem) => updateTodoItem(field.properties.fieldId, index, newItem)}  />))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
