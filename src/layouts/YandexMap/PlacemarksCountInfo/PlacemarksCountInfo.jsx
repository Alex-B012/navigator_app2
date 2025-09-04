import "./placemarksCountInfo.css";

function PlacemarksCountInfo({ number }) {
  return (
    <div id="placemarksCount_id">
      {`Number of placemarks:  `} <span>{` ${number}`}</span>
    </div>
  );
}

export default PlacemarksCountInfo;
