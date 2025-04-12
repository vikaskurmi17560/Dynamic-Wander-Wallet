import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { EditProfile } from "@/connection/userConnection";
import useUserData from "@/hook/useData";
import style from "./form.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


const Form = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const { user } = useUserData();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      phone_no: user?.phone_no || "",
      profile: undefined,
      banner: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("bio", user.bio);
      setValue("phone_no", user.phone_no);
      setValue("profile", user.profile);
    }
  }, [user, setValue]);

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
        onClose();
        router.replace("/profile");
      } catch (error) {
        toast.error("Some error occurred");
      }
    }
  }

  return (
    <div className={style.main}>
      <div className={style.container}>
        <FontAwesomeIcon icon={faTimes} onClick={onClose} className={style.close_btn} />
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(editData)}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
              {user?.profile ? (
                <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
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
              type="text"
              className={style.input}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Bio</label>
            <textarea
              {...register("bio")}
              className={style.textarea}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Phone Number</label>
            <input
              {...register("phone_no")}
              type="tel"
              className={style.input}
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
  );
};

export default Form;
