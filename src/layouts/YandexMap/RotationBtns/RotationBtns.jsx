import { icons } from "../../../assets/assets";
import "./rotationBtns.css";

function RotationBtns({ degree, rotateMap }) {
  return (
    <div className="rotationBtns">
      <h2 className="rotationBtns__title">Rotate Map</h2>
      <div className="rotationBtns__angle">
        <span>{degree}</span> Degree
      </div>
      <div className="rotationBtns__container">
        <button
          className="rotationBtns__btn rotationBtns__btn-left"
          onClick={() => rotateMap(-1)}
        >
          Rotate
          <img
            className="rotationBtns__img rotationBtns__img-left"
            src={icons.rotationArrow_left}
            alt="Left Rotation Button"
          />
        </button>
        <button
          className="rotationBtns__btn rotationBtns__btn-right"
          onClick={() => rotateMap(1)}
        >
          Rotate
          <img
            className="rotationBtns__img rotationBtns__img-left"
            src={icons.rotationArrow_right}
            alt="Right Rotation Button"
          />
        </button>
      </div>
    </div>
  );
}

export default RotationBtns;
