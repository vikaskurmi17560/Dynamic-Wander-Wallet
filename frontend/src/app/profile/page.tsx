'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import useData from "../../hook/useData";


function profile() {
  const [post, setPost] = useState<Boolean>(true);
  const [videos, setVideos] = useState<Boolean>(false);
  const [others, setOthers] = useState<Boolean>(false);
  const router = useRouter();

  const { user, isAuthenticated } = useData();




  if (isAuthenticated) {
    return (

      <main className='w-full min-h-screen flex flex-col bg-slate-200 mt-[15vh] '>
        <section className='flex flex-col gap-24'>
          <section style={{ backgroundImage: `url(${user.banner})` }} className="relative w-[100%] bg-cover bg-center pl-6 h-60 bg-slate-600 flex items-center ">
            {user.profile ? <img src={user.profile} alt='profile image' className="w-[200px] absolute top-[50%] h-[200px] bg-slate-300 rounded-full flex justify-center items-center" />
              :
              <div className="w-[200px] absolute top-[50%] h-[200px] bg-slate-300 rounded-full flex justify-center items-center" >
                profile
              </div>}
          </section>

          <section className="w-full h-fit flex flex-row gap-4 bg-gray-400 justify-around p-4">

            <div className="w-[35%] h-fit flex flex-col bg-gray-100 p-4 gap-4">

              <div className="grid grid-cols-[15%_5%_80%] ">
                <div className="font-bold text-xl ">Name</div>
                <div className="font-bold text-xl text-black">:</div>
                <div className="text-lg">{user.name}</div>

                <div className="font-bold text-xl ">Bio</div>
                <div className="font-bold text-xl text-black">:</div>
                <div className="text-lg">
                  {user.bio}
                </div>
              </div>

              <div className="grid grid-cols-[18%_2%_80%] ">
                <div className="font-bold text-xl ">Contact</div>
                <div className="font-bold text-xl text-black">:</div>
                <div className="text-lg">{user.phone_no}</div>
              </div>



              {/* Edit Profile Button */}
              <button className="w-full text-center p-2 bg-slate-300 text-black font-bold rounded hover:bg-slate-400"
                onClick={() => { router.push("/form") }}
              >
                Edit Profile
              </button>
            </div>


            <div className="w-[60%] h-fit flex flex-col gap-8">

              <div className="w-full grid grid-cols-4 bg-gray-100 p-4 rounded text-center">
                <div className="text-black font-bold text-4xl">164</div>
                <div className="text-black font-bold text-4xl">164</div>
                <div className="text-black font-bold text-4xl">164</div>
                <div className="text-black font-bold text-4xl">164</div>

                <div className="text-gray-700 font-semibold text-2xl">Posts</div>
                <div className="text-gray-700 font-semibold text-2xl">Followers</div>
                <div className="text-gray-700 font-semibold text-2xl">Followings</div>
                <div className="text-gray-700 font-semibold text-2xl">Videos</div>
              </div>
              <div className="w-full p-4 text-center text-gray-500 text-xl bg-blue-200">contents</div>
            </div>
          </section>

        </section>

        <section className="w-[100%] h-[200px] flex overflow-x-scroll space-x-4 snap-x scrollbar-hide px-4 py-4">


          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>
          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>
          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>
          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>
          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>
          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>
          <div className="bg-black rounded-full w-[150px] h-[150px] "></div>



        </section>
        <section className="flex flex-col gap-10">
          <div className="grid grid-cols-3 px-5 text-4xl text-black font-semibold text-center">
            <div className={`cursor-pointer border-b-4 ${post === true ? "border-black" : "border-none"}  `} onClick={() => {
              setPost(true);
              setVideos(false);
              setOthers(false);
            }}>post</div>
            <div className={`cursor-pointer border-b-4  ${videos === true ? " border-black" : "border-none"}  `} onClick={() => {
              setVideos(true);
              setPost(false);
              setOthers(false);
            }}>video</div>
            <div className={`cursor-pointer border-b-4 ${others === true ? " border-black" : "border-none"}  `} onClick={() => {
              setOthers(true);
              setPost(false);
              setVideos(false);
            }}>other</div>
          </div>
          <div className=" h-auto w-[100%]">
            {post === true && (
              <div className="  w-[100%] grid grid-cols-4 gap-2 text-white">
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
                <p className="w-[98%] h-[300px] bg-black">post</p>
              </div>
            )}

            {videos === true && (
              <div className="  w-[100%] grid grid-cols-4 gap-2 text-white">
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
                <p className="w-[98%] h-[300px] bg-black">video</p>
              </div>
            )}

            {others === true && (
              <div className=" w-[100%] grid grid-cols-4 gap-2 text-white">
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
                <p className="w-[98%] h-[300px] bg-black">others</p>
              </div>
            )}


          </div>
        </section>
      </main>
    )
  } else {
    return null
  }
}

export default profile;


