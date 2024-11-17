import { DashboardScreenProps } from "@/routes/Dashboard";
import { MutableRefObject, useRef, useEffect, useState } from "react";
import { MapView } from "../MapView";
import * as turf from '@turf/turf';
import { Button } from "@/components/shadcn-ui/button";
import MapboxDraw, { DrawSelectionChangeEvent } from '@mapbox/mapbox-gl-draw';
import { Plus, X } from "lucide-react";
import { useAuthenticatedData } from "../AuthenticatedDataContext";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { FarmFieldProperties } from "@/model/FarmField";
import { DashboardManagePopoverMode } from "../types/DashboardManagePopoverMode";
import { apiService } from "@/service/api";
import { Feature, Polygon } from "geojson";
import { GeoJSONSource } from "mapbox-gl";
import { MapRef } from "react-map-gl";

const POPOVER_OFFSET_X = 300;
const POPOVER_OFFSET_Y = 100;

const drawControl = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
  defaultMode: 'draw_polygon'
});

export const DashboardManageScreen: React.FC<DashboardScreenProps> = ({active}) => {  
  const { token, fields, refreshFields } = useAuthenticatedData();
  const [isAddingField, setIsAddingField] = useState(false);

  const isAddingFieldStateRef = useRef(isAddingField);
  isAddingFieldStateRef.current = isAddingField;

  const mapRef: MutableRefObject<MapRef|null> = useRef(null);
  const [fieldPropertiesPopupOpen, setFieldPropertiesPopupOpen] = useState(false);
  const [fieldPropertiesPopupPosition, setFieldPropertiesPopupPosition] = useState<[number, number] | null>(null);

  const popoverContentRef: MutableRefObject<HTMLDivElement|null> = useRef<HTMLDivElement>(null);

  const [fieldPropertiesPopupActiveField, setFieldPropertiesPopupActiveField] = useState<FarmFieldProperties|null>(null);
  const [fieldPropertiesPopupActiveFeatureId, setFieldPropertiesPopupActiveFeatureId] = useState<string | undefined>(undefined);
  const [fieldPropertiesPopupMode, setFieldPropertiesPopupMode] = useState<DashboardManagePopoverMode>(DashboardManagePopoverMode.Edit);

  useEffect(() => {
    if (mapRef.current === null) 
      return;

    mapRef.current.on('mouseenter', 'states-layer', () => {
      mapRef.current!.getCanvas().style.cursor = 'pointer';
    });
    mapRef.current.on('mouseleave', 'states-layer', () => {
      mapRef.current!.getCanvas().style.cursor = '';
    });

    mapRef.current.on('draw.selectionchange', function (e: DrawSelectionChangeEvent) {
      if (e.features.length === 0) {
        setFieldPropertiesPopupOpen(false);
        setFieldPropertiesPopupActiveField(null);
        setFieldPropertiesPopupActiveFeatureId(undefined);    
        return;
      }

      const center = turf.center(e.features[0].geometry);
      const projected = mapRef.current?.project(center.geometry.coordinates as [number, number]);

      setFieldPropertiesPopupPosition(center.geometry.coordinates as [number, number]);
      setFieldPropertiesPopupOpen(true);
      setFieldPropertiesPopupActiveField(e.features[0].properties as FarmFieldProperties || {});
      setFieldPropertiesPopupActiveFeatureId(e.features[0].id as string|undefined);
      setFieldPropertiesPopupMode(DashboardManagePopoverMode.Create);
    });
  }, [fields, isAddingField]);

  useEffect(() => {
    if (active)
      mapRef.current?.resize();
  }, [active]);

  useEffect(() => {
    if (mapRef.current === null)
      return;

    if (isAddingField && !mapRef.current.hasControl(drawControl)) {
      mapRef.current.addControl(drawControl);
    } else if (!isAddingField && mapRef.current.hasControl(drawControl)) {
      mapRef.current.removeControl(drawControl);
    }
  }, [isAddingField]);

  const onAddFieldButtonClick = () => {
    setIsAddingField(!isAddingField);
    setFieldPropertiesPopupOpen(false);
  };

  const setActivePopoverFieldProperties = (properties: FarmFieldProperties) => {
    setFieldPropertiesPopupActiveField(properties);

    if (!isAddingField)
      return;

    drawControl.setFeatureProperty(fieldPropertiesPopupActiveFeatureId!, 'fieldName', properties.fieldName);
    drawControl.setFeatureProperty(fieldPropertiesPopupActiveFeatureId!, 'cropType', properties.cropType);
    drawControl.setFeatureProperty(fieldPropertiesPopupActiveFeatureId!, 'cropPlanted', properties.cropPlanted);
    drawControl.setFeatureProperty(fieldPropertiesPopupActiveFeatureId!, 'cropHarvest', properties.cropHarvest);
  };

  // update fields data on map when its changed
  useEffect(() => {
    console.log("Updating fields data on map");
    if (mapRef.current === null || !fields)
      return;

    const source = mapRef.current?.getSource('user-fields') as GeoJSONSource;
    if (source === undefined)
      return;
    
    source.setData(fields);
  }, [fields]);

  const onAddSaveChangesButtonClick = async () => {
    // validate polygon data
    const data = drawControl.getAll();
    const valid = data.features.every((feature) => {
      const properties = feature.properties as FarmFieldProperties;
      return properties.fieldName && properties.cropType && properties.cropPlanted && properties.cropHarvest;
    });
    if (!valid) {
      console.error("Invalid polygon data: ", data);
      return;
    }

    // convert to list of individual features
    const features = data.features.map((feature) => {
      const properties = feature.properties as FarmFieldProperties;
      return {
        type: 'Feature',
        geometry: feature.geometry,
        properties: properties,
      };
    });

    for (const feature of features) {
      await apiService.addField(token, feature as Feature<Polygon>);
    }

    setFieldPropertiesPopupActiveField(null);
    setFieldPropertiesPopupActiveFeatureId(undefined);
    onAddFieldButtonClick();

    refreshFields();
  };

  const onEditSaveChangesButtonClick = async () => {
    if (fieldPropertiesPopupActiveFeatureId === undefined)
      return;

    const currFeature = mapRef.current!.queryRenderedFeatures({layers: ['fields-layer']}).find((feature) => feature.id === fieldPropertiesPopupActiveFeatureId);

    // update api
    await apiService.updateField(token, {type: currFeature!.type, geometry: currFeature!.geometry as Polygon, properties: fieldPropertiesPopupActiveField });

    setFieldPropertiesPopupActiveField(null);
    setFieldPropertiesPopupActiveFeatureId(undefined);
    setFieldPropertiesPopupOpen(false);

    refreshFields();
  };

  const onEditRemoveButtonClick = async () => {
    if (fieldPropertiesPopupActiveFeatureId === undefined)
      return;

    await apiService.deleteField(token, fieldPropertiesPopupActiveField!.fieldId);

    setFieldPropertiesPopupActiveField(null);
    setFieldPropertiesPopupActiveFeatureId(undefined);
    setFieldPropertiesPopupOpen(false);

    refreshFields();
  };

  return (
    <div className={`${active ? "" : "hidden "}h-full relative`}>
      <div className="w-full h-full">
        <MapView 
          mapRef={mapRef} 
          farmFieldsSource={null} 
          popupOpen={fieldPropertiesPopupOpen} 
          fieldPropertiesPopupActiveMode={fieldPropertiesPopupMode}
          fieldPropertiesPopupActiveField={fieldPropertiesPopupActiveField} 
          fieldPropertiesPopupPosition={fieldPropertiesPopupPosition} 
          fieldPropertiesPopupOnSave={onEditSaveChangesButtonClick}
          fieldPropertiesPopupOnRemove={onEditRemoveButtonClick}
          fieldPropertiesPopupSetProperties={setActivePopoverFieldProperties}
          setPopupOpen={setFieldPropertiesPopupOpen} 
        />
      </div>
      
      <Button variant="outline" className="absolute top-4 left-4" onClick={onAddFieldButtonClick}>
        {isAddingField ? 
          <>
            <X/> <span>Cancel</span>
          </>
        :
          <>
            <Plus/> <span>Add Field</span>
          </>
        }
      </Button>
      {isAddingField &&
        <Button variant="default" className="absolute w-1/2 max-w-lg bottom-6 left-1/2 transform -translate-x-1/2" onClick={onAddSaveChangesButtonClick}>Save Changes</Button>
      }

      {/*
      <DashboardManagePopover 
        popoverContentRef={popoverContentRef} 
        mode={popoverMode} 
        fieldProperties={popoverActiveField} 
        setFieldProperties={setActivePopoverFieldProperties} 
        setPopoverOpen={setPopoverOpen} 
        onSave={onEditSaveChangesButtonClick}
        onRemove={onEditRemoveButtonClick}
      />
      */}
    </div>
  );
};
