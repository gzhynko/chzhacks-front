import { FarmEmployee } from "@/model/FarmEmployee";

export interface TodoListItem {
  text: string;
  assignedEmployee: FarmEmployee|null;
};
