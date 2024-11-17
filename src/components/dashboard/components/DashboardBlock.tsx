import { Maximize2 } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";

interface DashboardBlockProps {
  children: React.ReactNode;
  onExpand?: () => void;
}

export const DashboardBlock: React.FC<DashboardBlockProps> = ({children, onExpand}) => {
  return (
    <div className="w-full h-full bg-white">
      <div className="relative w-full h-full flex flex-col rounded-2xl">
        {onExpand && 
          <Button variant="outline" className="flex flex-row absolute top-3 right-3 z-10" onClick={onExpand}>
            <Maximize2/> Expand
          </Button>
        }
        {children}
      </div>
    </div>
  )
};
