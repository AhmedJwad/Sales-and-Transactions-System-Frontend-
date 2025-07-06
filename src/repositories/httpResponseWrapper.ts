export interface HttpResponseWrapper<T> {
    response: T | null;
    error: boolean;
    statusCode: number;
    message?: string;
  }