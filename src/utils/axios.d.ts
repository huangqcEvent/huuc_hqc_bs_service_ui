// axios.d.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    userType?: string;
  }

  interface InternalAxiosRequestConfig extends AxiosRequestConfig {}
}
