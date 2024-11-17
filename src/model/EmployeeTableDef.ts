import { FarmEmployee } from "@/model/FarmEmployee"
import { ColumnDef } from "@tanstack/react-table"
 
export const columns: ColumnDef<FarmEmployee>[] = [
  {
    accessorKey: "employeeName",
    header: "Name",
  },
  {
    accessorKey: "employeeRole",
    header: "Role",
  },
  {
    accessorKey: "employeePhone",
    header: "Phone",
  },
  {
    accessorKey: "employeeEmail",
    header: "Email",
  },
]
