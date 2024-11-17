import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover";
import { columns } from "@/model/EmployeeTableDef";
import { FarmEmployee } from "@/model/FarmEmployee";
import { apiService } from "@/service/api";
import { Plus } from "lucide-react";
import { useState } from "react";

interface DashboardEmployeesScreenProps {
  active: boolean;
}

export const DashboardEmployeesScreen: React.FC<DashboardEmployeesScreenProps> = ({active}) => {
  let { token, employees } = useAuthenticatedData();
  const [newEmployee, setNewEmployee] = useState<FarmEmployee>({employeeName: "", employeeEmail: "", employeePhone: "", employeeRole: ""});

  const onAddEmployee = async () => {
    await apiService.addEmployee(token, newEmployee);
  }

  return (
    <div className={`flex flex-col gap-3 ${active ? "" : "hidden "}h-full`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-40" variant="default"><Plus />Add Employee</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-3">
          <p className="text-lg font-bold">Add Employee</p>
          <div className="flex flex-col gap-2">
            <Input type="text" placeholder="Name" value={newEmployee.employeeName} onChange={(e) => setNewEmployee({...newEmployee, employeeName: e.target.value})} />
            <Input type="text" placeholder="Email" value={newEmployee.employeeEmail} onChange={(e) => setNewEmployee({...newEmployee, employeeEmail: e.target.value})} />
            <Input type="text" placeholder="Phone" value={newEmployee.employeePhone} onChange={(e) => setNewEmployee({...newEmployee, employeePhone: e.target.value})} />
            <Input type="text" placeholder="Role" value={newEmployee.employeeRole} onChange={(e) => setNewEmployee({...newEmployee, employeeRole: e.target.value})} />
          </div>
          <Button variant="default" onClick={onAddEmployee}>Add</Button>
        </PopoverContent>
      </Popover>
      <DataTable columns={columns} data={employees ?? []} />
    </div>  
  );
};
