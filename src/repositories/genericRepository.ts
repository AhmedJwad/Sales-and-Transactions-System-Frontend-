import httpService from "../services/httpService"

const genericRepository=(method: string)=>({
    get:async(params =null)=>{
        try {
            const data=await httpService.get(`${method}`,params)   
            return data;
        } catch (error) {
            throw new Error ("Error fetching user data")            
        }
    },
    getById: async (id:string | number) => {
        try {
          const data = await httpService.get(`${method}/${id}`);
          return data;
        } catch (error) {
          throw new Error("Error fetching user data");
        }
      },
      post:async(body:Record<string, any>)=>{
        try {
            var data=await httpService.post(`${method}`,body);
            return data;            
        } catch (error) {
            throw new Error("Error fetching user data");            
        }
      },
      put:async(body:Record<string, any>)=>{
        try {
            const data=await httpService.put(`${method}`, body)      
            return data;      
        } catch (error) {
            throw new Error("Error fetching user data");            
        }
      },
      delete: async (id:string | number) => {
        try {
          const data = await httpService.delete(`${method}/${id}`);
          return data;
        } catch (error) {
          throw new Error("Error fetching user data");
        }
      },
});
export default genericRepository;