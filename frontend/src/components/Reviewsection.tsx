'use client';

import { useEffect, useRef } from 'react';


const cards = [
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 1,  name:'Card 1', description: 'This is the first card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 2,  name:'Card 2', description: 'This is the second card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 3,  name:'Card 3', description: 'This is the third card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 4,  name:'Card 4', description: 'This is the fourth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 5,  name:'Card 5', description: 'This is the fifth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 6,  name:'Card 6', description: 'This is the sixth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 7,  name:'Card 7', description: 'This is the seventh card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 8,  name:'Card 8', description: 'This is the eighth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 9,  name:'Card 9', description: 'This is the ninth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 10, name: 'Card 10', description: 'This is the tenth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 11, name: 'Card 11', description: 'This is the first card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 12, name: 'Card 12', description: 'This is the second card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 13, name: 'Card 13', description: 'This is the third card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 14, name: 'Card 14', description: 'This is the fourth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 15, name: 'Card 15', description: 'This is the fifth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 16, name: 'Card 16', description: 'This is the sixth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 17, name: 'Card 17', description: 'This is the seventh card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 18, name: 'Card 18', description: 'This is the eighth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 19, name: 'Card 19', description: 'This is the ninth card' },
  { profile:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" , id: 20, name: 'Card 20', description: 'This is the tenth card' },
];

export default function InfiniteScrollCards() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const duplicateCards = [...cards, ...cards];
    let scrollSpeed = 1;
    let animationFrameId: number;

    const scroll = () => {
      if (container) {
        container.scrollTop += scrollSpeed;
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <main className="w-full flex flex-col">


   <section className="w-full h-auto gap-2  ">
    <div className="text-black flex flex-col gap-2 justify-center items-center py-2">
        <h1 className='text-4xl font-semibold'>Loved by thousands of people</h1>
        <p className="text-xl">Here's what some of our users have to say about Dynamic Wander wallet.</p>
    </div>

   <div ref={containerRef} className="relative h-[70vh]  overflow-hidden flex flex-col scrollbar-hide  [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]  ">
      <div className=" bg-slate-100 grid grid-cols-4 md:grid-cols-5 gap-4 animate-scroll " >
        {[...cards, ...cards].map((card,index) => (
          <div
            key={index}
            className="bg-slate-300 shadow-lg p-4 rounded-lg text-center flex flex-col gap-4"
          >
            <div className="flex flex-row justify-evenly">
            <figure>
                <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" className='w-12 h-12' alt="image" />
            </figure>
            <h3 className="text-lg font-bold py-2">{card.name}</h3>
            </div>
            
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>

   </section>

    </main>
  );
}