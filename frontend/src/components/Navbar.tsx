import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <main className='w-screen lg:h-20 md:h-16 h-10 bg-green-300 flex flex-row justify-between items-center text-black '>
          <Link href={"/"} className='lg:text-3xl md:text-2xl text-[15px] font-bold lg:pl-4 md:pl-3 pl-1'>LOGO</Link>
          <section className='flex flex-row justify-between lg:gap-20 md:gap-16 gap-4'>
            <div className="lg:text-2xl md:text-xl text-[11px] font-semibold ">option1</div>
            <div className="lg:text-2xl md:text-xl text-[11px] font-semibold ">option2</div>
            <div className="lg:text-2xl md:text-xl text-[11px] font-semibold ">option3</div>
            {/* <div className="">option4</div>
            <div className="">option5</div> */}
          </section>
          <section className='flex flex-row justify-between lg:pr-4 md:pr-3 pr-1 lg:gap-6 md:gap-4 gap-2'>
            <Link href={"/profile"} className='lg:text-2xl md:text-xl text-[11px] font-semibold'>profile</Link>
            <div className="lg:text-2xl md:text-xl text-[11px] font-semibold">Login</div>
            <div className="lg:text-2xl md:text-xl text-[11px] font-semibold ">Free Signup</div>
          </section>
    </main>
  )
}

export default Navbar;