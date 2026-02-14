import React, { useState } from "react";
import bg from "../../assets/images/bg.jpg";
import bg1 from "../../assets/images/bg1.png";
import bg3 from "../../assets/images/bg3.png";
import { Carousel } from "react-bootstrap";

export const BackgroundImageSlider = () => {
  const backgrounds = [bg, bg1, bg3];
  const [bgIndex, setBgIndex] = useState(0);
  const handleSelectBackground = (selectedIndex) => {
    setBgIndex(selectedIndex);
  };
  return (
    <div className="background-slider">
      <Carousel
        activeIndex={bgIndex}
        onSelect={handleSelectBackground}
        interval={20000}
      >
        {backgrounds.map((background, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={background}
              alt={`Slide ${index}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BackgroundImageSlider;
