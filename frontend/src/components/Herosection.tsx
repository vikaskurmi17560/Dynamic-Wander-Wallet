import React from 'react'
import { FloatingDock } from "@/components/ui/floating-dock";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";
import {
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";


function Herosection() {

  const cards = [
    {
      heading: "RANIKHET",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
    {
      heading: "RISHIKESH",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
    {
      heading: "HARIDWAR",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
    {
      heading: "KEDARNATH",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
    {
      heading: "BADHRINATH",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
    
    {
      heading: "VALLEY OF FLOWER",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
   
    
    {
      heading: "CHOPTA",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
  
    {
      heading: "BINSAR",
      image: "https://uttarakhandtourism.net/wp-content/uploads/2024/03/desti_chopta-510x540.jpg",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab error veritatis, beatae fuga sint?"
    },
   
  ];

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];


  return (
    <main className='flex bg-white  w-full h-auto  flex-col '>

      <section className="bg-[url('https://stippl.io/assets/background_visual_footer-dfc36cdf.svg')] lg:h-[80vh] md:h-[60vh] h-[100px] w-[100%] bg-cover bg-center flex flex-col justify-center items-center 
sm:bg-[length:100%_auto] md:bg-cover lg:bg-cover bg-no-repeat gap-4">

        <div className="w-[50%] lg:h-[65vh] md:h-64 h-[20vh] flex flex-col justify-center items-center lg:gap-5 md:gap-4 gap-2 pt-20 ">
          <div className='lg:text-5xl md:text-3xl text-[15px] font-bold '>
            <h1 className='text-green-600 text-center '>One travel app</h1>
            <h1 className='text-gray-900 text-center'>to replace them all</h1>
          </div>
          <p className='lg:text-xl md:text-sm text-[8px] text-black  text-center '>We want to be on each of your journeys seeking the satisfaction of seeing the incorruptible beauty of nature. We can help you on an adventure around the uttrakhand in just one app</p>
          <button className=' lg:py-2 lg:px-5 md:py-1 md:px-3 py-1 px-3 lg:text-xl md:text-sm text-[10px] text-white hover:bg-white border-green-600 border-2 rounded-full hover:border-green-600 bg-green-600 hover:text-green-600 font-bold text-center '>Get started. It's FREE</button>
        </div>



        <div className=" flex items-center justify-center h-fit w-[100%]">
          <FloatingDock
            mobileClassName="translate-y-20" // only for demo, remove for production
            items={links}
          />
        </div>

      </section>

      <section className="w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 via-black to-gray-100 dark:bg-white">
  <p className="text-orange-400 text-xl text-center py-4">Most Visited Destinations</p>
  <h1 className="text-white dark:text-black text-4xl font-bold text-center pb-5">
    Explore Our Tour Destinations..
  </h1>
  
  <div className="h-auto  grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 justify-center items-center">
    {cards.map((card, index) => (
      <CardContainer className="inter-var " key={index}>
        <CardBody className="w-[98%] h-fit bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl lg:p-10 md:p-10 p-5 border flex flex-col">
          
          <CardItem  className="text-xl font-bold text-neutral-600 dark:text-white">
            {card.heading}
          </CardItem>

          <CardItem translateZ="100" rotateX={20} rotateZ={-5} className="w-full mt-4">
            <Image
              src={card.image.trim()} // Ensure no extra spaces in URL
              height={1000}
              width={1200}
              className="h-fit w-fit object-cover rounded-xl group-hover/card:shadow-xl"
              alt="Destination image"
            />
          </CardItem>

          <CardItem as="p" translateZ="100" rotateX={20}  className="text-neutral-500 text-sm max-w-sm py-6 dark:text-neutral-300 text-center">
            {card.desc}
          </CardItem>

          <div className="flex flex-row justify-between items-center mt-5">
            <CardItem  as="button" className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white text-black">
              Try now →
            </CardItem>
            <CardItem
           as="button"
              className="px-4 py-2 rounded-xl hover:bg-white border-green-600 border-2 text-white hover:border-green-600 bg-green-600 hover:text-green-600 text-xs font-bold"
            >
              Sign up
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    ))}
  </div>

  {/* Centering the "See More!" Button */}
  <div className="w-full flex justify-center m-5">
    <button className="hover:bg-white border-green-600 border-2 rounded-xl text-white text-3xl md:text-2xl text-[15px] font-bold hover:border-green-600 bg-green-600 hover:text-green-600 lg:py-2 lg:px-10 md:py-1 md:px-5 py-1 px-2">
      See More..
    </button>
  </div>
</section>

    </main>
  )
}

export default Herosection;