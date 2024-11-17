import { FarmEmployee } from "@/model/FarmEmployee";

export interface TodoListItem {
  text: string;
  assignedEmployees: FarmEmployee[];
};
