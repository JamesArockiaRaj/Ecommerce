import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft,faChevronRight} from '@fortawesome/free-solid-svg-icons'
import './Slider.css';
function Slider() {
        const sliderImages = [ 
           {
              url: "https://www.tripjodi.in/wp-content/uploads/2017/10/DSCN8956-1.jpg",
           },
           {
              url: "https://editorial01.shutterstock.com/preview-440/11844351aa/b5e8f939/Shutterstock_11844351aa.jpg",
           },
           {
              url: "https://ttdconline.com/_next/velankanni/2.jpg",
           },
        ];
        const [activeImageNum, setCurrent] = useState(0);
        const length = sliderImages.length;
        const nextSlide = () => {
           setCurrent(activeImageNum === length - 1 ? 0 : activeImageNum + 1);
        };
        const prevSlide = () => {
           setCurrent(activeImageNum === 0 ? length - 1 : activeImageNum - 1);
        };
        if (!Array.isArray(sliderImages) || sliderImages.length <= 0) {
           return null;
        }
  return (
    <div>
    <section className = "image-slider">
       <div class = "left">
          <FontAwesomeIcon icon={faChevronLeft}  onClick = {prevSlide}  />
       </div>
       <div class="right"> 
          <FontAwesomeIcon icon={faChevronRight}  onClick = {nextSlide} />
       </div>
       {sliderImages.map((currentSlide, ind) => {
          return (
             <div
                className={ind === activeImageNum ? "currentSlide active" : "currentSlide"}
                key={ind}
             >
                {ind === activeImageNum && <img src={currentSlide.url} className="image"/>}
             </div>
          );
       })}
    </section>
 </div>

    
  );
}

export default Slider;