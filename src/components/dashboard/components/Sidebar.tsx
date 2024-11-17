import { NavLink } from "react-router-dom";
import { Button, buttonVariants } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu"
import { ChevronUp, Home, LogOut, Sprout, Tractor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn-ui/avatar";
import { useAuthenticatedData } from "@/components/AuthenticatedDataContext";

export const Sidebar: React.FC = () => {
  const {logOut} = useAuthenticatedData();

  return (
    <div className="flex flex-col w-72 h-full shrink-0 bg-white border-r">
      <div className="border-b p-3 h-[56px]">
        <div className="flex items-center">
          <Sprout className="w-8 h-8 mr-2 text-primary" />
          <span className="text-xl font-bold">ForeFarm</span>
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-2 p-4">
        <NavLink to="home" className={({ isActive }) => `${buttonVariants({ variant: isActive ? "secondary" : "ghost" })} w-full h-11 !justify-start`}>
          <Home/> Home
        </NavLink>
        <NavLink to="manage" className={({ isActive }) => `${buttonVariants({ variant: isActive ? "secondary" : "ghost" })} w-full h-11 !justify-start`}>
          <Tractor/> Manage Farmland
        </NavLink>
      </div>
      <div className="border-t px-4 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex flex-row justify-between h-11 w-full">
              <div className="h-full flex flex-row items-center gap-2">
                <Avatar className="h-full w-auto">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
              </div>
              <ChevronUp/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => logOut()}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
