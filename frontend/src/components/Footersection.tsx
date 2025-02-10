"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import { AnimatedTestimonials } from "./ui/animated-testimonials";

const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Vikas Kurmi",
      designation: "Product Manager at TechFlow",
      src: "https://res.cloudinary.com/dplwgsngu/image/upload/v1732371530/uvs9ln32r2h5p3cuxeav.jpg",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
  ];

function Footersection() {
  return (
    <AuroraBackground>
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4"
    >
     <AnimatedTestimonials testimonials={testimonials} />
    </motion.div>
  </AuroraBackground>
  )
}

export default Footersection
