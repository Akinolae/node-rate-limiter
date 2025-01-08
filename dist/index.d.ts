import { Request } from 'express';
type Requestparams = {
    ttl?: number;
    session_no?: number;
    request: Request;
};
declare const limitCorefn: (args: Requestparams) => void;
export { limitCorefn as requestLimitCore };
