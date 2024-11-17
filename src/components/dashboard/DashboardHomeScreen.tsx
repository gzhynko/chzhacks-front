import { MapView } from "@/components/MapView";
import { DashboardBlock } from "./components/DashboardBlock";
import { DashboardScreenProps } from "@/routes/Dashboard";
import * as turf from '@turf/turf';
import { MutableRefObject, useEffect, useRef } from "react";
import { DashboardHomeAlerts } from "./components/DashboardHomeAlerts";
import { DashboardHomeFields } from "./components/DashboardHomeFields";
import { useAuthenticatedData } from "../AuthenticatedDataContext";
import { MapRef } from "react-map-gl";

export const DashboardHomeScreen: React.FC<DashboardScreenProps> = ({active}) => {
  const { fields } = useAuthenticatedData();
  const mapRef: MutableRefObject<MapRef|null> = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) 
      return;

  }, [fields]);

  useEffect(() => {
    if (active)
      mapRef.current?.resize();
  }, [active]);

  const onAlertClick = (fieldId: string) => {
    const fieldCoordinates = turf.center(fields!.features.find((f) => f.properties.fieldId === fieldId)!);
    mapRef.current?.flyTo({center: fieldCoordinates.geometry.coordinates as [number, number]});
  };

  return (
    <div className={`flex flex-col gap-3 ${active ? "" : "hidden "}h-full`}>
      <div className="h-1/2 flex flex-row gap-3 justify-between items-center">
        <DashboardBlock>
          <DashboardHomeAlerts />
        </DashboardBlock>
        <DashboardBlock>
          <DashboardHomeFields onAlertClick={onAlertClick} />
        </DashboardBlock>
      </div>
      <div className="w-full h-1/2">
        <DashboardBlock>
          <MapView mapRef={mapRef} farmFieldsSource={null} />
        </DashboardBlock>
      </div>
    </div>
  );
};
