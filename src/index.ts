import { RequestStore, RequestStoreObject, Requestparams } from './types/types';

enum Intervals {
  // Query every 1 minute
  Query = 1 * 60 * 1000,
  request = 10,
}

let requestBucket: RequestStoreObject;

/**
 * @param {*} id
 * @returns a single call that matches the provided ID
 * checks if the call id exists in the interval-list
 */

const findRequestbyId = (params: {
  callId: string;
  functionId: string;
}): RequestStore | undefined => {
  const { callId, functionId } = params;
  if (!callId || !functionId) {
    throw new Error('INTERVAL_CACHE_ERROR:CallId and functionId is required');
  }

  const requestFromBucket =
    requestBucket !== undefined ? requestBucket[callId] : [];
  if (Array.isArray(requestFromBucket) && requestFromBucket.length > 0) {
    for (const interval of requestFromBucket) {
      if (new RegExp(interval.callID).test(functionId)) {
        return interval;
      } else {
        return;
      }
    }
  }
};

/**
 * @param {IntervalObj} params
 * filters the call list array, removes duplicate before adding a new call object
 * checks if the call id exists in the interval-list
 */

const addRequestToList = (params: {
  callid: string;
  requestObject: RequestStore;
}) => {
  const { callid, requestObject, ...rest } = params;

  // Check that the callid exists before performing any mutation
  const callidExists = Object.keys(requestBucket || {}).some(
    (id) => id === callid,
  );

  if (!callidExists) {
    requestBucket = {
      ...requestBucket,
      ...rest,
      [callid]: [requestObject],
    };
  } else {
    const currentInterval = [
      ...requestBucket[callid].filter(
        (a) => a?.callID !== requestObject.callID,
      ),
      requestObject,
    ];

    requestBucket = {
      ...requestBucket,
      [callid]: currentInterval,
    };
  }

  return requestBucket;
};

/**
 * @param {*} params
 * does the necessary checks and also updates the state of each request
 */
const limitCorefn = (args: Requestparams) => {
  /**
   * Checks to know if fn by callId exists in scope
   * Adds call to the scope if it doesn't exist
   */

  const { callId, functionId, session_no, ttl } = args;

  const interval = ttl ?? Intervals.Query;
  const session = session_no ?? Intervals.request;
  const callIDexists = findRequestbyId({ callId, functionId });
  const date = new Date();

  let requestBody: any;

  //add fn() to scope if it doesn't exist
  if (!callIDexists || !Object.keys(callIDexists).length) {
    requestBody = {
      callid: callId,
      requestObject: {
        callID: callId,
        request: session,
        ttl: interval,
        lastCall: +date,
      },
    };
  } else if (
    callIDexists.request === 1 &&
    date.getTime() - callIDexists.lastCall > interval
  ) {
    requestBody = {
      callid: callIDexists.callID,
      requestObject: {
        callID: callIDexists.callID,
        request: session,
        ttl: callIDexists.ttl,
        lastCall: callIDexists.lastCall,
      },
    };
  } else {
    if (!callIDexists.request) {
      throw new Error(
        `TOO MANY REQUESTS: call ${callId} has too many requests try again in ${Math.floor(
          callIDexists.ttl / 60000,
        )} minute(s)`,
      );
    } else {
      const newRequestLimit = callIDexists.request - 1;
      requestBody = {
        callid: callIDexists.callID,
        requestObject: {
          callID: callIDexists.callID,
          request: newRequestLimit,
          ttl: callIDexists.ttl,
          lastCall: +date,
        },
      };
    }
  }

  addRequestToList(requestBody);
};

export { limitCorefn as requestLimitCore };
