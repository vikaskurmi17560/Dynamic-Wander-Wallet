import React from 'react'
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";


function Herosection() {

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
    <main className='flex  w-screen h-auto  flex-col '>
      
        <section className="bg-[url('https://stippl.io/assets/background_visual_footer-dfc36cdf.svg')] lg:h-[80vh] md:h-[60vh] h-[100px] w-full bg-cover bg-center flex flex-col justify-center items-center 
sm:bg-[length:100%_auto] md:bg-cover lg:bg-cover bg-no-repeat gap-4">

          <div className="w-[50%] lg:h-[65vh] md:h-64 h-[20vh] flex flex-col justify-center items-center lg:gap-5 md:gap-4 gap-2 pt-20 ">
            <div className='lg:text-5xl md:text-3xl text-[15px] font-bold '>
              <h1 className='text-green-600 text-center '>One travel app</h1>
              <h1 className='text-gray-900 text-center'>to replace them all</h1>
            </div>
            <p className='lg:text-xl md:text-sm text-[8px] text-black  text-center '>We want to be on each of your journeys seeking the satisfaction of seeing the incorruptible beauty of nature. We can help you on an adventure around the uttrakhand in just one app</p>
            <button className=' lg:py-2 lg:px-5 md:py-1 md:px-3 py-1 px-3 lg:text-xl md:text-sm text-[10px] text-white hover:bg-white border-green-600 border-2 rounded-full hover:border-green-600 bg-green-600 hover:text-green-600 font-bold text-center '>Get started. It's FREE</button>
          </div>
         
         
          <div className="flex items-center justify-center h-fit w-[100%]">
            <FloatingDock
              mobileClassName="translate-y-20" // only for demo, remove for production
              items={links}
            />
          </div>

        </section>

        <section className=""></section>
        <section className=""></section>
        <section className=""></section>
      
    </main>
  )
}

export default Herosection;