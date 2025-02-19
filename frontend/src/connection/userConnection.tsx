import { SignupURL,SigninURL } from "@/urls/allurls";
import axios from "axios";

export async function Register(formdata: any) {
    try {
        const response = await axios.post(SignupURL, formdata);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function Signin(formdata:any){
    
    try {
        const  response =await axios.post(SigninURL,formdata)
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
