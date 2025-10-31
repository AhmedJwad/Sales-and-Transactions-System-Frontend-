import httpService from "../services/httpService";
import { HttpResponseWrapper } from "./httpResponseWrapper";

const genericRepository = <IList, IItem>(method: string) => {
 
  const handleRequest = async <T>(request: Promise<HttpResponseWrapper<T>>): Promise<HttpResponseWrapper<T>> => {
    try {
      const data = await request;
     /*  return {
        response: data.response ?? null,
        error: false,
        statusCode: data.statusCode ?? 200,
        message: data.message ?? undefined,
      }; */
      if (data.response) {
      return {
        response: data.response ?? null,
        statusCode: data.statusCode ?? 200,
        message: data.message ?? undefined,
        error: false,
      };
    } else {
      return {
        response: null,
        statusCode: data.statusCode ,
        message: data.message,
        error: true,
      };
    }
    } catch (error: any) {
      return {
        response: null,
        error: true,
        statusCode: error?.response?.status || 500,
        message: error?.message || "Unknown error",
      };
    }
  };

  return {   
    getAll: (params: Record<string, any> | null = null): Promise<HttpResponseWrapper<IList>> =>
      handleRequest(httpService.get<IList>(`${method}`, params)),
      getAllByQuery: <T>(query: string): Promise<HttpResponseWrapper<T>> => { 
        const match = query.match(/method=([^&]+)/);
        const customMethod = match ? match[1] : method;
        const newQuery = query.replace(/method=[^&]+&?/, "");
        return handleRequest(httpService.get<T>(`${customMethod}${newQuery}`));
      },
    getOne: (id: string | number): Promise<HttpResponseWrapper<IItem>> =>
      handleRequest(httpService.get<IItem>(`${method}/${id}`)),
  
    post: (body: Record<string, any>): Promise<HttpResponseWrapper<IItem>> =>
      handleRequest(httpService.post<IItem>(`${method}`, body)), 
    put: (body: Record<string, any>): Promise<HttpResponseWrapper<IItem>> =>
      handleRequest(httpService.put<IItem>(`${method}`, body)),
   
    delete: (id: string | number): Promise<HttpResponseWrapper<IItem>> =>
      handleRequest(httpService.delete<IItem>(`${method}/${id}`)),
    
  };
};

export default genericRepository;
