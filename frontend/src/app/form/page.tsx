"use client";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { EditProfile } from "@/connection/userConnection";
import useUserData from "@/hook/useData";

function page() {
     const router = useRouter();
      const { register, handleSubmit } = useForm();
      
   const {name,profile,bio,phone_no}=useUserData();
   

 
   async function editData(formdata: any) {
     let user_id = localStorage.getItem("user_id");
 
     if (user_id) {
       try {
         const parsedId = JSON.parse(user_id);
         if (parsedId?.value) {
           user_id = parsedId.value;
         }
 
         const data = new FormData();
         data.append("name", formdata.name);
         data.append("bio", formdata.bio);
         data.append("phone_no", formdata.phone_no);
 
       
         if (formdata.profile[0]) {
           data.append("profile", formdata.profile[0]);
         }
         if (formdata.banner[0]) {
           data.append("banner", formdata.banner[0]);
         }
 
         const response = await EditProfile(user_id, data);
          
           router.replace("/profile");
         
       } catch (error) {
         toast.error("Some error occurred");
       }
     }
   }

  return (
    <div className="flex justify-center mt-10">
    <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-lg">
    
      <form className="mt-6 space-y-4"  onSubmit={handleSubmit(editData)}>
        <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          {profile ? (
            <img src={profile} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <label
          htmlFor="profileImage"
          className="text-blue-600 mt-2 text-sm font-semibold cursor-pointer"
        >
          Change Profile Photo
        </label>
        <input
         {...register("profile")}
          id="profileImage"
          type="file"
          className="hidden"
          accept="image/*"
        />
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Name</label>
          <input
            {...register("name")}
            value={name}
            type="text"
            className="px-2 border-b-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Bio</label>
          <textarea
            {...register("bio")}
            value={bio}
            className="px-2 border-b-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Phone Number</label>
          <input
            {...register("phone_no")}
            value={phone_no}
            type="tel"
            className="px-2 border-b-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-900">Profile Banner</label>
          <input
            {...register("banner")}
            type="file"
            className="mt-1 w-full"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
  )
}

export default page