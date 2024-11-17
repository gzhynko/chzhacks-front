import React, { MutableRefObject, useEffect, useState } from "react";
import Map, { Layer, MapRef, Popup, Source } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { FarmFieldGeoJSONCollection, FarmFieldProperties } from "@/model/FarmField";
import { RenderAfterMap } from "@/components/RenderAfterMap";
import { DashboardManagePopup } from "@/components/dashboard/components/DashboardManagePopup";
import { DashboardManagePopoverMode } from "@/components/types/DashboardManagePopoverMode";

interface MapViewProps {
  mapRef: MutableRefObject<MapRef|null>;
  farmFieldsSource: FarmFieldGeoJSONCollection | null;

  popupOpen?: boolean;
  setPopupOpen?: (open: boolean) => void;
  fieldPropertiesPopupPosition?: [number, number] | null;
  fieldPropertiesPopupActiveField?: FarmFieldProperties | null;
  fieldPropertiesPopupActiveMode?: DashboardManagePopoverMode | null;
  fieldPropertiesPopupSetProperties?: (properties: FarmFieldProperties) => void;
  fieldPropertiesPopupOnSave?: () => void;
  fieldPropertiesPopupOnRemove?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ 
  mapRef, 
  farmFieldsSource, 
  fieldPropertiesPopupPosition, 
  fieldPropertiesPopupActiveField, 
  fieldPropertiesPopupActiveMode, 
  popupOpen, 
  setPopupOpen,
  fieldPropertiesPopupSetProperties,
  fieldPropertiesPopupOnSave,
  fieldPropertiesPopupOnRemove,
}) => {  
  return (
    <Map 
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1IjoiZ3poeW5rbyIsImEiOiJjbTNham5senQwZXFhMnNxMnFsNjhqcXY5In0.E4aR48r88T7hA00H99oLCQ"
      mapStyle="mapbox://styles/gzhynko/cm3kq1zrm00iz01ry1xn7azjc"
      style={{borderRadius: '1rem'}}
      initialViewState={{
        latitude: 44.739441,
        longitude: -89.749356,
        zoom: 6.25,
      }}
    >
      <RenderAfterMap>
        {farmFieldsSource !== null && (
        <Source id="user-fields" type="geojson" data={farmFieldsSource}>
          <Layer id="fields-layer" type="fill" paint={{'fill-color': 'rgba(200, 100, 240, 0.4)', 'fill-outline-color': 'rgba(200, 100, 240, 1)'}} />
          <Layer id="fields-names" type="symbol" layout={{'text-field': ['get', 'fieldName'], 'text-anchor': 'center'}} />
        </Source>
        )}
        {(fieldPropertiesPopupPosition !== null && popupOpen) && (
          <div className="w-2">
            <Popup 
              latitude={fieldPropertiesPopupPosition![1]} 
              longitude={fieldPropertiesPopupPosition![0]} 
              onClose={() => setPopupOpen!(false)}
              maxWidth="18rem"
              style={{width: '18rem'}}
            >
              <DashboardManagePopup 
                mode={fieldPropertiesPopupActiveMode!} 
                fieldProperties={fieldPropertiesPopupActiveField!} 
                setFieldProperties={fieldPropertiesPopupSetProperties!} 
                setPopoverOpen={setPopupOpen!} 
                onSave={fieldPropertiesPopupOnSave} 
                onRemove={fieldPropertiesPopupOnRemove} 
              />
            </Popup>
          </div>
        )}  
      </RenderAfterMap>
    </Map>
  );
};
