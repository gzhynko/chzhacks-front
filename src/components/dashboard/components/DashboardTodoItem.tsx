import { DashboardTodoItemEmployeeDropdown } from "@/components/dashboard/components/DashboardTodoItemEmployeeDropdown";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { FarmEmployee } from "@/model/FarmEmployee";
import { TodoListItem } from "@/model/TodoListItem";
import { useState } from "react";

interface DashboardTodoItemProps {
  todoItem: TodoListItem;
  updateItem: (item: TodoListItem) => void;
}

export const DashboardTodoItem: React.FC<DashboardTodoItemProps> = ({ todoItem, updateItem }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<FarmEmployee | null>(todoItem.assignedEmployees[0] ?? null);
  const [text, setText] = useState(todoItem.text);
  return (
    <div className="flex flex-col gap-2 border p-2 w-full rounded-lg">
      <DashboardTodoItemEmployeeDropdown selectedEmployee={selectedEmployee} setEmployee={setSelectedEmployee} />
      <div className="flex flex-row gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="What do you want to do?" />
        <Button onClick={() => updateItem({ ...todoItem, text: text, assignedEmployees: selectedEmployee ? [selectedEmployee] : [] })}>Save</Button>
      </div>
    </div>
  )
};
