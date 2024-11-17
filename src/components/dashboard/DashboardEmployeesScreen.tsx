import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { columns } from "@/model/EmployeeTableDef";

interface DashboardEmployeesScreenProps {
  active: boolean;
}

export const DashboardEmployeesScreen: React.FC<DashboardEmployeesScreenProps> = ({active}) => {
  const { employees } = useAuthenticatedData();

  return (
    <div className={`flex flex-col gap-3 ${active ? "" : "hidden "}h-full`}>
      <DataTable columns={columns} data={employees} />
    </div>  
  );
};
