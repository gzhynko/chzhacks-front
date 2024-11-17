import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";

interface RenderAfterMapProps {
  children: React.ReactNode;
};

export const RenderAfterMap: React.FC<RenderAfterMapProps> = ({children}) => {
  const map = useMap();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    map.current?.on('load', () => setCanRender(true));
  }, [map])

  return <>{canRender && children}</>
};
