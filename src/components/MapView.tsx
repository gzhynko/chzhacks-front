import React, { MutableRefObject } from "react";
import Map, { Layer, MapMouseEvent, MapRef, Popup, Source } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { FarmFieldGeoJSONCollection, FarmFieldProperties } from "@/model/FarmField";
import { RenderAfterMap } from "@/components/RenderAfterMap";
import { DashboardManagePopup } from "@/components/dashboard/components/DashboardManagePopup";
import { DashboardManagePopoverMode } from "@/components/types/DashboardManagePopoverMode";

interface MapViewProps {
  mapRef: MutableRefObject<MapRef|null>;
  farmFieldsSource: FarmFieldGeoJSONCollection | null;
  
  onClick?: (e: MapMouseEvent) => void;
  popupOpen?: boolean;
  setPopupOpen?: (open: boolean) => void;
  fieldPropertiesPopupPosition?: [number, number] | null;
  fieldPropertiesPopupActiveField?: FarmFieldProperties | null;
  fieldPropertiesPopupActiveMode?: DashboardManagePopoverMode | null;
  fieldPropertiesPopupSetProperties?: (properties: FarmFieldProperties) => void;
  fieldPropertiesPopupOnSave?: () => void;
  fieldPropertiesPopupOnRemove?: () => void;
  fieldPropertiesPopupIsSaving?: boolean;
  fieldPropertiesPopupIsRemoving?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ 
  mapRef, 
  farmFieldsSource, 
  fieldPropertiesPopupPosition, 
  fieldPropertiesPopupActiveField, 
  fieldPropertiesPopupActiveMode,
  onClick,
  popupOpen, 
  setPopupOpen,
  fieldPropertiesPopupSetProperties,
  fieldPropertiesPopupOnSave,
  fieldPropertiesPopupOnRemove,
  fieldPropertiesPopupIsSaving,
  fieldPropertiesPopupIsRemoving,
}) => {  
  return (
    <Map 
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1IjoiZ3poeW5rbyIsImEiOiJjbTNham5senQwZXFhMnNxMnFsNjhqcXY5In0.E4aR48r88T7hA00H99oLCQ"
      mapStyle="mapbox://styles/gzhynko/cm3kq1zrm00iz01ry1xn7azjc"
      style={{borderRadius: '1rem'}}
      onClick={onClick}
      interactiveLayerIds={['fields-layer']}
      initialViewState={{
        latitude: 44.739441,
        longitude: -89.749356,
        zoom: 6.25,
      }}
    >
      <RenderAfterMap>
        {farmFieldsSource !== null && (
        <Source id="user-fields" type="geojson" data={farmFieldsSource} generateId={true}>
          <Layer id="fields-layer" type="fill" paint={{'fill-color': 'rgba(200, 100, 240, 0.4)', 'fill-outline-color': 'rgba(200, 100, 240, 1)'}} />
          <Layer id="fields-names" type="symbol" layout={{'text-field': ['get', 'fieldName'], 'text-anchor': 'center'}} />
        </Source>
        )}
        {(fieldPropertiesPopupPosition && popupOpen) && (
          <Popup 
            latitude={fieldPropertiesPopupPosition[1]} 
            longitude={fieldPropertiesPopupPosition[0]} 
            onClose={() => {console.log("popup onclose"); setPopupOpen!(false)}}
            maxWidth="18rem"
            style={{width: '18rem'}}
            closeOnClick={false}
          >
            <DashboardManagePopup 
              mode={fieldPropertiesPopupActiveMode!} 
              fieldProperties={fieldPropertiesPopupActiveField!} 
              setFieldProperties={fieldPropertiesPopupSetProperties!} 
              setPopupOpen={setPopupOpen!} 
              onSave={fieldPropertiesPopupOnSave} 
              isSaving={fieldPropertiesPopupIsSaving}
              onRemove={fieldPropertiesPopupOnRemove}
              isRemoving={fieldPropertiesPopupIsRemoving} 
            />
          </Popup>
        )}  
      </RenderAfterMap>
    </Map>
  );
};
