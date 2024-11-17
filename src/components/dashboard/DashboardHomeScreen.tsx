import { MapView } from "@/components/MapView";
import { DashboardBlock } from "./components/DashboardBlock";
import { DashboardScreenProps } from "@/routes/Dashboard";
import * as turf from '@turf/turf';
import { MutableRefObject, useEffect, useRef } from "react";
import { DashboardHomeAlerts } from "./components/DashboardHomeAlerts";
import { DashboardHomeFields } from "./components/DashboardHomeFields";
import { useAuthenticatedData } from "../AuthenticatedDataContext";
import { GeoJSONSource, MapRef } from "react-map-gl";

export const DashboardHomeScreen: React.FC<DashboardScreenProps> = ({active}) => {
  const { fields } = useAuthenticatedData();
  const mapRef: MutableRefObject<MapRef|null> = useRef(null);

  useEffect(() => {
    if (active)
      mapRef.current?.resize();
  }, [active]);

  // update fields data on map when its changed
  useEffect(() => {
    if (mapRef.current === null || !fields)
      return;

    // fit map to fields
    if (fields.features.length > 0) {
      const bbox = turf.bbox(fields);
      mapRef.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding: 10, animate: false});
    }

    const source = mapRef.current?.getSource('user-fields') as GeoJSONSource;
    if (source === undefined)
      return;
    
    source.setData(fields);
  }, [fields]);

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
          <MapView mapRef={mapRef} farmFieldsSource={fields} />
        </DashboardBlock>
      </div>
    </div>
  );
};
