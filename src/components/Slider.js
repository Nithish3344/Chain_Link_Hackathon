import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
// import "./Slider.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Slider = () => {
  return (
    <div className="slider_container w-[100vw] my-7">
      <div className="w-[90%] mx-auto">
        <div className="elipse" id="upper_elipse"></div>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            // dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="slide flex justify-center items-center">
              <img src={require("../assets/slider1.png")}></img>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide flex justify-center items-center">
              <img src={require("../assets/slider2.png")}></img>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide flex justify-center items-center">
              <img src={require("../assets/slider3.png")}></img>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="elipse" id="lower_elipse"></div>
      </div>
    </div>
  );
};

export default Slider;
