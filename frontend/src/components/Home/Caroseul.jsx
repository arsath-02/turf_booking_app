import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import image1 from '../../../public/turf5.jpeg';
import image2 from '../../../public/turf1.jpg';
import image3 from '../../../public/turf2.jpg';
import image4 from '../../../public/turf3.jpg';

export const Hero = () => {
  return (
    <section id="hero" className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <Carousel showThumbs={false} autoPlay infiniteLoop>
        <div className="relative">
          <img src={image1} alt="Slide 1" className="w-full h-auto transition-all duration-300 ease-in-out" />
        </div>
        <div className="relative">
          <img src={image2} alt="Slide 2" className="w-full h-auto transition-all duration-300 ease-in-out" />
        </div>
        <div className="relative">
          <img src={image3} alt="Slide 3" className="w-full h-auto transition-all duration-300 ease-in-out" />
        </div>
        <div className="relative">
          <img src={image4} alt="Slide 4" className="w-full h-auto transition-all duration-300 ease-in-out" />
        </div>
      </Carousel>
    </section>
  );
}

export default Hero;
