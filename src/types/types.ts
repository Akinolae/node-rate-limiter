type RequestStore = {
  callID: string;
  request: number;
  ttl: number;
  lastCall: number;
};

type Requestparams = {
  callId: string;
  functionId: string;
  ttl?: number;
  session_no?: number;
};

type RequestStoreObject = {
  [key: string]: Array<RequestStore>;
};

export { RequestStore, Requestparams, RequestStoreObject };
