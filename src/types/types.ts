type RequestStore = {
  callID: string;
  request: number;
  ttl: number;
  lastCall: number;
  requestIp: string;
};

type Requestparams = {
  requestIp: string;
  functionId: string;
  ttl?: number;
  session_no?: number;
};

type RequestStoreObject = {
  [key: string]: Array<RequestStore>;
};

export { RequestStore, Requestparams, RequestStoreObject };
