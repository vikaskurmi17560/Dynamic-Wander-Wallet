"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const banners = [
  {
    image: "https://uttarakhandtourism.net/wp-content/uploads/2023/12/home_banner_1.jpg",

  },

  {
    image: "https://uttarakhandtourism.net/wp-content/uploads/2023/12/home_banner_3.jpg",
  },

  {
    image: " https://uttarakhandtourism.net/wp-content/uploads/2023/12/home_banner_6.jpg",

  },


];

function Herosection() {

  return (
    <main className='flex bg-white  w-full h-auto  flex-col mt-24'>
      <section className='w-full'>

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          loop={true} // Enable loop to prevent reverse direction
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="mySwiper w-full h-[90vh]"
        >
          {banners.map((data, index) => (
            <SwiperSlide
              key={index}
            >
              <div
                style={{ backgroundImage: `url(${data.image})` }}
                className="w-full h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center text-white"
              >
                <div className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] flex flex-col justify-center items-center text-center pt-5 gap-6 md:gap-8 lg:gap-10">
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-7xl font-extrabold">
                    One travel app
                  </h1>
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-7xl font-extrabold text-gray-200">
                    to replace them all
                  </h1>

                  <p className="text-xs sm:text-sm md:text-lg lg:text-2xl text-gray-100">
                    We want to be on each of your journeys, seeking the satisfaction of
                    seeing the incorruptible beauty of nature. We can help you on an
                    adventure around Uttarakhand in just one app.
                  </p>

                  <button className="py-2 px-4 sm:py-2 sm:px-5 md:py-3 md:px-6 lg:py-4 lg:px-8 text-xs sm:text-sm md:text-lg lg:text-xl text-white hover:bg-white border-green-600 border-2 rounded-full hover:border-green-600 bg-green-600 hover:text-green-600 font-bold text-center transition duration-300 ease-in-out">
                    Get started. It's FREE
                  </button>
                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </section>


    </main>
  )
}

export default Herosection;
