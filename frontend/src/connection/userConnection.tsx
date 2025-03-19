import { SignupURL,SigninURL, GetUserURL, UpdateUserURL } from "@/urls/allurls";
import axios from "axios";


export async function Register(formdata: any) {
    try {
        const response = await axios.post(SignupURL, formdata);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function Signin(formdata:any){
    
    try {
        const  response = await axios.post(SigninURL,formdata)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export async function GetUser(id: string | null) {
    try {
      const response = await axios.get(`${GetUserURL}?user_id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  export async function EditProfile(id: string | null,formdata:any){
    try {
        const response = await axios.post(`${UpdateUserURL}?user_id=${id}`,formdata,{
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
  }
