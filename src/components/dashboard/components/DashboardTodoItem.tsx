import { DashboardTodoItemEmployeeDropdown } from "@/components/dashboard/components/DashboardTodoItemEmployeeDropdown";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { FarmEmployee } from "@/model/FarmEmployee";
import { TodoListItem } from "@/model/TodoListItem";
import { useState } from "react";

interface DashboardTodoItemProps {
  todoItem: TodoListItem;
  updateItem: (item: TodoListItem) => void;
  isEditing: boolean;
}

export const DashboardTodoItem: React.FC<DashboardTodoItemProps> = ({ todoItem, updateItem, isEditing }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<FarmEmployee | null>(todoItem.assignedEmployee ?? null);
  const [text, setText] = useState(todoItem.text);

  return (
    <div className="flex flex-col gap-2 border p-2 w-full rounded-lg">
      {isEditing ? (
        <DashboardTodoItemEmployeeDropdown selectedEmployee={selectedEmployee} setEmployee={setSelectedEmployee} />
      ) : (
        <div className="flex flex-row">
          <p className="text-xs">Assigned to:</p><p> {selectedEmployee?.employeeName}</p>
        </div>
      )}
      <div className="flex flex-row gap-2">
        {isEditing ? (
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="What do you want to do?" />
        ) : (
          <p>{text}</p>
        )}
        {isEditing && (
          <Button onClick={() => updateItem({ ...todoItem, text: text, assignedEmployee: selectedEmployee ?? null })}>Save</Button>
        )}
      </div>
    </div>
  )
};
