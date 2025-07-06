import httpService from "../services/httpService";
import { HttpResponseWrapper } from "./httpResponseWrapper";

const genericRepository = <IList, IItem>(method: string) => {
 
  const handleRequest = async <T>(request: Promise<HttpResponseWrapper<T>>): Promise<HttpResponseWrapper<T>> => {
    try {
      const data = await request;
      return {
        response: data.response ?? null,
        error: false,
        statusCode: data.statusCode ?? 200,
        message: data.message ?? undefined,
      };
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
