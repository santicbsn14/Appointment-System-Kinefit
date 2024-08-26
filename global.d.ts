import { Request } from 'express';

declare global {
  export interface CustomRequest<T = any> extends Request {
    body: T;
  }
}
