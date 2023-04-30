import React, { useState, useEffect, useRef } from "react";
import "./components.css";

const CustomRangeSlider = ({ min, max, value, onChange, leftLabel, rightLabel }) => {
  const railRef = useRef(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const railWidth = railRef.current.offsetWidth;
      setPosition(((value - min) / (max - min)) * railWidth);
    };

    updatePosition();
  }, [min, max, value]);

  const handleMouseDown = (e) => {
    const onMouseMove = (e) => {
      const railWidth = railRef.current.offsetWidth;
      const newPosition = Math.min(Math.max(e.pageX - railRef.current.getBoundingClientRect().left, 0), railWidth);
      const newValue = ((newPosition / railWidth) * (max - min)) + min;
      onChange(newValue);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="custom-range-slider">
      <div className="slider-rail" ref={railRef}>
        <div className="flex justify-between px-4 slider-labels items-center">
            <div className="left label">{leftLabel}</div>
            <div className="right label">{rightLabel}</div>
        </div>
        <div
          className="slider-thumb"
          style={{ left: position - 10 }}
          onMouseDown={handleMouseDown}
        ></div>
        
      </div>
    </div>
  );
};

export default CustomRangeSlider;
