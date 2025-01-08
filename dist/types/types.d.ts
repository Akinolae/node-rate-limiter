import { Request } from 'express';
type RequestStore = {
    callID: string;
    request: number;
    ttl: number;
    lastCall: number;
    requestIp: string;
};
type Requestparams = {
    ttl?: number;
    session_no?: number;
    request: Request;
};
type RequestStoreObject = {
    [key: string]: Array<RequestStore>;
};
export { RequestStore, Requestparams, RequestStoreObject };
