import axios from "axios";

const baseURL="https://localhost:7027/api/";

export const axiosInstance=axios.create({
    baseURL,
    timeout:30000,
    headers:{
        "Content-Type":"application/json"
    },
});

axiosInstance.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("jwtToken");
        if(token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }    
);
axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response && error.response.status===401)
        {
            localStorage.removeItem("jwtToken");
            window.location.href="/login"
        }       
        return Promise.reject(error);
    }
);

const httpService={
    get:async(url:string ,params=null)=>{
        const  response=await axiosInstance.get(`${url}`,{params})
        return response.data;
    },
    post:async(url:string, data:any)=>{
        const  response=await axiosInstance.post(`${url}`, data)
        return response.data
    },
    put:async(url:string, data:any)=>{
        const  response=await axiosInstance.put(`${url}`, data)
        return response.data
    },
    delete: async (url: string) => {
        const response = await axiosInstance.delete(`${url}`);
        return response.data;
      },
}

export default httpService;