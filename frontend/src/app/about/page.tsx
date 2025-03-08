import Footer from '@/components/FOOTER/Footer'
import Herosection from '@/components/Herosection'
import React from 'react'
const Teams = [
    {
        id: 1,
        photo: "https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2018/12/team2-free-img.png",
        name: "Harvey Spector",
        Role: "Founder - CEO"
    },
    {
        id: 6,
        photo: "https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2018/12/team1-free-img.png",
        name: "Jessica Pearson",
        Role: "COO"
    },
    {
        id: 2,
        photo: "https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2018/12/team3-free-img.png",
        name: "Rachel Zain",
        Role: "Marketing Head"
    },
    {
        id: 3,
        photo: "	https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2018/12/team4free-img.png",
        name: "Luise Litt",
        Role: "Lead Developer"
    },
    {
        id: 4,
        photo: "https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2018/12/team5-free-img.png",
        name: "Katrina Bennett",
        Role: "Intern Designer"
    },
    {
        id: 5,
        photo: "https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2018/12/team6-free-img.png",
        name: "Mike Ross",
        Role: "Intern Designer"
    },

]
function page() {
  return (
    <main className='mt-[15vh] '>
      <Herosection />
      <section className="w-full flex flex-col items-center px-4 mb-5">
  <h1 className="w-full h-auto text-5xl sm:text-6xl md:text-7xl text-black text-center mt-10 font-bold">
    Our Team
  </h1>
  <div className="w-full md:w-[80%] lg:w-[60%] mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {Teams.map((member) => (
      <div key={member.id} className="p-6 sm:p-8 md:p-12 bg-slate-100 rounded-md">
        <div className="flex items-center flex-col bg-slate-100">
          <img src={member.photo} alt="photo" className="mb-4 sm:mb-6 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full" />
          <h1 className="text-center w-full text-xl sm:text-2xl font-bold">{member.name}</h1>
          <h1 className="text-center w-full text-lg sm:text-xl">{member.Role}</h1>
        </div>
      </div>
    ))}
  </div>
</section>

     <Footer/>
    </main>
  )
}

export default page