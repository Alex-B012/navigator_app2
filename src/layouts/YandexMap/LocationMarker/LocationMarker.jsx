import { icons } from "../../../assets/assets";
import "./locationMarker.css";

function LocationMarker() {
  return (
    <div className="locationMarker">
      <img
        className="locationMarker__img"
        src={icons.locationMarker}
        alt="Location Marker"
      />
    </div>
  );
}

export default LocationMarker;
