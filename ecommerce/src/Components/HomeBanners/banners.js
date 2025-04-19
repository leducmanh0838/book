import React from "react";
import Slider from "react-slick";
import businessImg from '../../assets/imgBanner/business.png';
import shipImg from '../../assets/imgBanner/ship.png';

export default function HomeBanner() {
  
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay:true
  };

  return (
    <div className="homeBannerSection">
        <Slider {...settings}>

            <div className="item">
            <img src={businessImg} className="w-100" alt="Business banner" />
            </div>

            <div className="item">
            <img src={shipImg} className="w-100" alt="ship banner" />
            </div>

        </Slider>
    </div>

  )
};
