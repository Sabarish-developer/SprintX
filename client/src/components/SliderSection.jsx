import React, { forwardRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { data } from "../constants/objects";

const NextArrow = ({ onClick }) => {
  return (
    <div className="absolute top-0 right-0 mr-2 cursor-pointer z-10" onClick={onClick}>
      <div className="text-black text-6xl hover:text-purple-400">›</div>
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div className="absolute top-0 right-10 cursor-pointer z-10" onClick={onClick}>
      <div className="text-black text-6xl hover:text-purple-400">‹</div>
    </div>
  );
};

// ✅ This is the main fix – forwardRef used here
const SliderSlick = forwardRef((props, ref) => {
  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1000,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div ref={ref} className="w-full h-fit flex flex-col justify-center items-center px-4 lg:py-20 gap-6">
      <h1 className="text-3xl lg:text-5xl md:text-5xl text-black font-bold text-center">Why Choose Us?</h1>
      <p className="text-xl text-center">
        SprintX is project + knowledge management software that's a <br />
        force multiplier for your existing workflows, methodologies, and best practices.
      </p>
    

      <div className="w-full h-fit p-8">
        <Slider {...settings} className="max-w-4xl mx-auto rounded-2xl lg:shadow-lg md:shadow-lg">
          {data.map((item, index) => (
            <div
              id="slider-boxes"
              key={index}
              className="p-10 w-full cursor-pointer bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 rounded-xl flex flex-col justify-center items-center border-n"
            >
              <div id="icon-box" className="text-white bg-purple-400 p-6 rounded-full hover:bg-purple-500 cursor-pointer">
                {item.icon && <item.icon className="w-[45px] h-[45px]" />}
              </div>
              <div className="flex flex-col justify-center items-center gap-6 mt-6">
                <h1 className="text-2xl text-center text-white font-bold tracking-wide">{item.title}</h1>
                <p className="text-[17px] text-center text-white">{item.para}</p>
                <button className="text-white bg-purple-400 px-8 py-3 rounded-xl font-semibold hover:bg-purple-500 hover:text-white">
                  {item.label}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
});

export default SliderSlick;
