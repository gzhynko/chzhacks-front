import { useLocation } from "react-router-dom";
import { DashboardHomeScreen } from "@/components/dashboard/DashboardHomeScreen";
import { ScreenBase } from "@/components/dashboard/ScreenBase";
import { Sidebar } from "@/components/dashboard/components/Sidebar";
import { DashboardManageScreen } from "@/components/dashboard/DashboardManageScreen";
import { useCallback } from "react";
import { AuthenticatedDataProvider } from "@/components/AuthenticatedDataProvider";

export interface DashboardScreenProps {
  active: boolean;
}

export const Dashboard: React.FC = () => {
  const locationPathname = useLocation().pathname;
  const dashboardTab = locationPathname.split("/")[2];

  const activeScreenName = useCallback(() => {
    if (dashboardTab === "home") {
      return "Home";
    } else if (dashboardTab === "manage") {
      return "Manage Farmland";
    }
    return "";
  }, [dashboardTab]);

  return (
    <AuthenticatedDataProvider>
      <div className="flex flex-row h-screen">
        <Sidebar />
        <ScreenBase activeScreenName={activeScreenName()}>
          <DashboardHomeScreen active={dashboardTab === "home"}  />
          <DashboardManageScreen active={dashboardTab === "manage"}  />
        </ScreenBase>
      </div>
    </AuthenticatedDataProvider>
  );
};
