import { DashboardScreenProps } from "@/routes/Dashboard";
import { MutableRefObject, useRef, useEffect, useState } from "react";
import { MapView } from "../MapView";
import * as turf from '@turf/turf';
import { Button } from "@/components/shadcn-ui/button";
import MapboxDraw, { DrawSelectionChangeEvent } from '@mapbox/mapbox-gl-draw';
import { Loader2, Plus, X } from "lucide-react";
import { useAuthenticatedData } from "../AuthenticatedDataContext";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { FarmFieldProperties } from "@/model/FarmField";
import { DashboardManagePopoverMode } from "../types/DashboardManagePopoverMode";
import { apiService } from "@/service/api";
import { Feature, Polygon } from "geojson";
import { GeoJSONSource } from "mapbox-gl";
import { MapRef, MapMouseEvent } from "react-map-gl";
import { toast } from "@/components/shadcn-ui/hooks/use-toast";

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
  const [didFitBounds, setDidFitBounds] = useState(false);

  const [fieldPropertiesPopupActiveField, setFieldPropertiesPopupActiveField] = useState<FarmFieldProperties|null>(null);
  const [fieldPropertiesPopupActiveFeatureId, setFieldPropertiesPopupActiveFeatureId] = useState<string | undefined>(undefined);
  const [fieldPropertiesPopupMode, setFieldPropertiesPopupMode] = useState<DashboardManagePopoverMode>(DashboardManagePopoverMode.Edit);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (mapRef.current === null) 
      return;

    mapRef.current.on('draw.selectionchange', function (e: DrawSelectionChangeEvent) {
      if (e.features.length === 0) {
        setFieldPropertiesPopupOpen(false);
        setFieldPropertiesPopupActiveField(null);
        setFieldPropertiesPopupActiveFeatureId(undefined);    
        return;
      }

      const center = turf.center(e.features[0].geometry);

      setFieldPropertiesPopupPosition(center.geometry.coordinates as [number, number]);
      setFieldPropertiesPopupOpen(true);
      setFieldPropertiesPopupActiveField(e.features[0].properties as FarmFieldProperties || {});
      setFieldPropertiesPopupActiveFeatureId(e.features[0].id as string|undefined);
      setFieldPropertiesPopupMode(DashboardManagePopoverMode.Create);
    });

    mapRef.current.on('draw.delete', function () {
      setFieldPropertiesPopupOpen(false);
      setFieldPropertiesPopupActiveField(null);
      setFieldPropertiesPopupActiveFeatureId(undefined);
    });
  }, [mapRef.current]);

  const onMapClick = (e: MapMouseEvent) => {
    if (isAddingFieldStateRef.current)
      return;

    const feature = e.features?.find((feature) => feature.layer!.id === 'fields-layer');
    if (!feature) {
      setFieldPropertiesPopupOpen(false);
      setFieldPropertiesPopupActiveField(null);
      setFieldPropertiesPopupActiveFeatureId(undefined);
      return;
    }

    const center = turf.center(feature.geometry);
    setFieldPropertiesPopupPosition(center.geometry.coordinates as [number, number]);
    setFieldPropertiesPopupOpen(true);
    setFieldPropertiesPopupActiveField(feature.properties as FarmFieldProperties || {});
    setFieldPropertiesPopupActiveFeatureId(feature.id as string);
    setFieldPropertiesPopupMode(DashboardManagePopoverMode.Edit);
  };

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
    if (mapRef.current === null || !fields)
      return;

    // fit map to fields
    if (fields.features.length > 0  && !didFitBounds) {
      const bbox = turf.bbox(fields);
      mapRef.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding: 20, animate: false});
      setDidFitBounds(true);
    }

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
      toast({
        title: "Invalid field data",
        description: "Please make sure all fields are filled out",
        variant: "destructive",
      })
      return;
    }

    // convert to list of individual features
    const features = data.features.map((feature) => {
      const properties = feature.properties as FarmFieldProperties;
      properties.areaAcre = turf.round(turf.area(feature) / 4047, 1);
      return {
        type: 'Feature',
        geometry: feature.geometry,
        properties: properties,
      };
    });

    setIsSaving(true);
    for (const feature of features) {
      await apiService.addField(token, feature as Feature<Polygon>);
    }
    setIsSaving(false);

    setFieldPropertiesPopupActiveField(null);
    setFieldPropertiesPopupActiveFeatureId(undefined);
    onAddFieldButtonClick();

    refreshFields();
  };

  const onEditSaveChangesButtonClick = async () => {
    if (fieldPropertiesPopupActiveFeatureId === undefined)
      return;

    const currFeature = mapRef.current!.queryRenderedFeatures({layers: ['fields-layer']}).find((feature) => feature.id === fieldPropertiesPopupActiveFeatureId);

    setIsSaving(true);
    // update api
    await apiService.updateField(token, {type: currFeature!.type, geometry: currFeature!.geometry as Polygon, properties: fieldPropertiesPopupActiveField });
    setIsSaving(false);

    setFieldPropertiesPopupActiveField(null);
    setFieldPropertiesPopupActiveFeatureId(undefined);
    setFieldPropertiesPopupOpen(false);

    refreshFields();
  };

  const onEditRemoveButtonClick = async () => {
    if (fieldPropertiesPopupActiveFeatureId === undefined)
      return;

    setIsRemoving(true);
    await apiService.deleteField(token, fieldPropertiesPopupActiveField!.fieldId);
    setIsRemoving(false);

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
          farmFieldsSource={fields} 
          onClick={onMapClick}
          popupOpen={fieldPropertiesPopupOpen} 
          fieldPropertiesPopupActiveMode={fieldPropertiesPopupMode}
          fieldPropertiesPopupActiveField={fieldPropertiesPopupActiveField} 
          fieldPropertiesPopupPosition={fieldPropertiesPopupPosition} 
          fieldPropertiesPopupOnSave={onEditSaveChangesButtonClick}
          fieldPropertiesPopupIsSaving={isSaving}
          fieldPropertiesPopupOnRemove={onEditRemoveButtonClick}
          fieldPropertiesPopupIsRemoving={isRemoving}
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
        <Button variant="default" className="absolute w-1/2 max-w-lg bottom-6 left-1/2 transform -translate-x-1/2" onClick={onAddSaveChangesButtonClick} disabled={isSaving}>
          <Loader2 className={`animate-spin ${isSaving ? "" : "hidden"}`} />
          Save Changes
        </Button>
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
