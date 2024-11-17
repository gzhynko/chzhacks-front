import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";
import { Button } from "@/components/shadcn-ui/button";
import { Command } from "@/components/shadcn-ui/command";
import { cn } from "@/components/shadcn-ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover";
import { FarmEmployee } from "@/model/FarmEmployee";
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/shadcn-ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";

interface DashboardTodoItemEmployeeDropdownProps {
  selectedEmployee: FarmEmployee | null;
  setEmployee: (employee: FarmEmployee | null) => void;
}

export const DashboardTodoItemEmployeeDropdown: React.FC<DashboardTodoItemEmployeeDropdownProps> = ({ selectedEmployee, setEmployee }) => {
  const [open, setOpen] = useState(false);
  const { employees } = useAuthenticatedData();
  
  const employeeByName = (name: string) => employees.find((employee) => employee.employeeName === name) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedEmployee
            ? selectedEmployee.employeeName
            : "Assign employee..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search employees..." />
          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>
            <CommandGroup>
              {employees?.map((employee) => (
                <CommandItem
                  key={employee.employeeName}
                  value={employee.employeeName}
                  onSelect={(currentValue) => {
                    setEmployee(employeeByName(currentValue) === selectedEmployee ? null : employeeByName(currentValue))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedEmployee === employee ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {employee.employeeName}
                </CommandItem>
              )) ?? <></>} 
            </CommandGroup> 
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
};
