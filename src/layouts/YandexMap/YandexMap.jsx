import { useEffect, useRef, useState, useCallback } from "react";
import "./yandexMap.css";
import LocationMarker from "../../components/LocationMarker/LocationMarker";
import RotationBtns from "./RotationBtns/RotationBtns";
import PlacemarksCountInfo from "./PlacemarksCountInfo/PlacemarksCountInfo";

const YandexMap = () => {
  const placemarksRef = useRef([]);
  const linesRef = useRef([]);
  const mapRef = useRef(null);
  const [placemarksCount, setPlacemarksCount] = useState(0);
  const [rotationDegree, setRotationDegree] = useState(0);
  const MAX_PLACEMARKS = 15;

  // Compare coordinates
  const areCoordinatesEqual = (coords1, coords2, tolerance = 0.0003) => {
    if (coords1 && coords2) {
      const lat1 = coords1[0];
      const lon1 = coords1[1];
      const lat2 = coords2[0];
      const lon2 = coords2[1];

      return (
        Math.abs(lat1 - lat2) < tolerance && Math.abs(lon1 - lon2) < tolerance
      );
    }
    return false;
  };

  const removeAllLines = () => {
    const currentMap = mapRef.current;
    if (!currentMap) return;

    linesRef.current.forEach((line) => {
      currentMap.geoObjects.remove(line);
    });

    linesRef.current = [];
  };

  const drawLines = useCallback(() => {
    const currentMap = mapRef.current;
    if (!currentMap) return;

    removeAllLines();
    placemarksRef.current.forEach((placemark, index) => {
      if (index > 0) {
        const line = new window.ymaps.GeoObject({
          geometry: {
            type: "LineString",
            coordinates: placemarksRef.current.map((p) =>
              p.geometry.getCoordinates()
            ),
          },
          properties: {
            name: `Line ${index}`,
          },
        });

        line.options.set("strokeColor", "#0000FF");
        line.options.set("strokeWidth", 4);
        currentMap.geoObjects.add(line);
        linesRef.current.push(line);
      }
    });
  }, []);

  const handleClick = useCallback(
    (e) => {
      const currentMap = mapRef.current;
      if (!currentMap) return;

      const coords = e.get("coords");

      if (
        areCoordinatesEqual(
          placemarksRef.current[0].geometry.getCoordinates(),
          coords
        )
      ) {
        return;
      }

      const existingPlacemark = placemarksRef.current.find((placemark) => {
        const placemarkCoords = placemark.geometry.getCoordinates();
        return areCoordinatesEqual(placemarkCoords, coords);
      });

      if (existingPlacemark) {
        removeAllLines();

        currentMap.geoObjects.remove(existingPlacemark);
        placemarksRef.current = placemarksRef.current.filter(
          (placemark) => placemark !== existingPlacemark
        );

        setPlacemarksCount(placemarksRef.current.length);
        drawLines();
      } else if (placemarksRef.current.length < MAX_PLACEMARKS) {
        const placemark = new window.ymaps.Placemark(coords, {
          hintContent: `Точка ${placemarksRef.current.length + 1}`,
        });

        currentMap.geoObjects.add(placemark);
        placemarksRef.current.push(placemark);

        setPlacemarksCount(placemarksRef.current.length);

        if (placemarksRef.current.length > 1) {
          const line = new window.ymaps.GeoObject({
            geometry: {
              type: "LineString",
              coordinates: placemarksRef.current.map((p) =>
                p.geometry.getCoordinates()
              ),
            },
            properties: {
              name: `Line ${placemarksRef.current.length - 1}`,
            },
          });

          line.options.set("strokeColor", "#0000FF");
          line.options.set("strokeWidth", 4);
          currentMap.geoObjects.add(line);

          linesRef.current.push(line);
        }
      } else {
        alert(`Можно добавить не более ${MAX_PLACEMARKS} точек.`);
      }
    },
    [drawLines]
  );

  // Map initialization
  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const initialCoords = [55.6935, 37.6279];

    if (apiKey) {
      const existingScript = document.querySelector(
        'script[src^="https://api-maps.yandex.ru/2.1/"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
          if (window.ymaps) {
            window.ymaps.ready(() => {
              const newMap = new window.ymaps.Map("map", {
                center: initialCoords,
                zoom: 17,
              });

              mapRef.current = newMap;

              const initialPlacemark = new window.ymaps.Placemark(
                initialCoords,
                {
                  hintContent: "First placemark",
                }
              );
              newMap.geoObjects.add(initialPlacemark);
              placemarksRef.current.push(initialPlacemark);

              setPlacemarksCount(placemarksRef.current.length);

              newMap.events.add("click", handleClick);
            });
          } else {
            console.error("Error: window.ymaps is not defined.");
          }
        };

        script.onerror = () => {
          console.error("Error: Yandex.Maps script loading issue");
        };

        document.head.appendChild(script);
      }
    } else {
      console.error("API key not found!");
    }
  }, [handleClick]);

  // Rotate map
  const changeDegree = useCallback((num) => {
    const angle = 15;

    setRotationDegree((prev) => {
      let newValue = prev + num * angle;

      if (newValue >= 360) {
        return newValue - 360;
      } else if (newValue < 0) {
        return newValue + 360;
      } else {
        return newValue;
      }
    });
  }, []);

  return (
    <div>
      <div className="mapFrame">
        <div className="mapFrame__top"></div>
        <div className="mapFrame__right"></div>
        <div className="mapFrame__bottom"></div>
        <div className="mapFrame__left"></div>
        <div
          id="map"
          style={{
            width: "2500px",
            height: "2500px",
            transform: `rotate(${rotationDegree * -1}deg)`,
          }}
        />
        <LocationMarker />
      </div>
      <div className="mapBottom">
        <PlacemarksCountInfo number={placemarksCount} />
        <RotationBtns degree={rotationDegree} rotateMap={changeDegree} />
      </div>
    </div>
  );
};

export default YandexMap;
