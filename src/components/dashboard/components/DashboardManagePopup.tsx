import { DashboardManagePopoverMode } from "@/components/types/DashboardManagePopoverMode";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { FarmFieldProperties } from "@/model/FarmField";
import { Loader2, X } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { Label } from "@/components/shadcn-ui/label";

interface DashboardManagePopoverProps {
  mode: DashboardManagePopoverMode;
  fieldProperties: FarmFieldProperties | null;
  setFieldProperties: (properties: FarmFieldProperties) => void;
  setPopupOpen: (open: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
}

export const DashboardManagePopup: React.FC<DashboardManagePopoverProps> = ({ mode, fieldProperties, setFieldProperties, setPopupOpen, onSave, isSaving, onRemove, isRemoving }) => {
  return fieldProperties ? (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        <p className="text-lg font-medium leading-none">{mode === DashboardManagePopoverMode.Edit ? fieldProperties.fieldName : "New Field"}</p>
        <Button variant="ghost" className="p-1 h-fit" onClick={() => setPopupOpen(false)}><X/></Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fieldName">Name</Label>
        <Input 
          id="fieldName"
          placeholder="Name" 
          value={fieldProperties.fieldName ?? ""} 
          onChange={(e) => setFieldProperties({...fieldProperties, fieldName: e.target.value})}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cropType">Crop Type</Label>
        <Input 
          id="cropType"
          placeholder="Crop Type" 
          value={fieldProperties.cropType ?? ""} 
          onChange={(e) => setFieldProperties({...fieldProperties, cropType: e.target.value})}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Planted Date</Label>
        <DatePicker 
          placeholder="Planted Date" 
          date={fieldProperties.cropPlanted ?? null} 
          onSelect={(date) => setFieldProperties({...fieldProperties, cropPlanted: date!})}
        />
      </div>
      <div className="flex flex-col gap-1.5">
      <Label>Harvest Date</Label>
        <DatePicker 
          placeholder="Harvest Date" 
          date={fieldProperties.cropHarvest ?? null} 
          onSelect={(date) => setFieldProperties({...fieldProperties, cropHarvest: date!})}
        />
      </div>
      
      {mode === DashboardManagePopoverMode.Edit && (
        <div className="flex flex-row gap-2">
          <Button variant="destructive" className="w-full" onClick={onRemove} disabled={isRemoving}>
            <Loader2 className={`animate-spin ${isRemoving ? "" : "hidden"}`} />
            Remove
          </Button>
          <Button variant="outline" className="w-full" onClick={onSave} disabled={isSaving}>
            <Loader2 className={`animate-spin ${isSaving ? "" : "hidden"}`} />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  ) : null;
};
