export interface ActionResponse<T> {
  wasSuccess: boolean;
  result?: T;
  message?: string;
}