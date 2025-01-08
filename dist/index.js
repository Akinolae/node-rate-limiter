"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLimitCore = void 0;
var Intervals;
(function (Intervals) {
    Intervals[Intervals["Query"] = 60000] = "Query";
    Intervals[Intervals["request"] = 10] = "request";
})(Intervals || (Intervals = {}));
let requestBucket;
const regexCheck = (defaultVal, val) => new RegExp(defaultVal).test(val);
const findRequestbyId = (params) => {
    const { requestIp, functionId } = params;
    if (!requestIp || !functionId) {
        throw new Error('INTERVAL_CACHE_ERROR:CallId and functionId is required');
    }
    const requestFromBucket = requestBucket !== undefined ? requestBucket[requestIp] : [];
    if (Array.isArray(requestFromBucket) && requestFromBucket.length > 0) {
        for (const interval of requestFromBucket) {
            if (regexCheck(interval.callID, functionId)) {
                return { ...interval, requestIp };
            }
            else {
                return;
            }
        }
    }
};
const addRequestToList = (params) => {
    const { requestIp, requestObject, ...rest } = params;
    const callidExists = Object.keys(requestBucket || {}).some((id) => id === requestIp);
    if (!callidExists) {
        requestBucket = {
            ...requestBucket,
            ...rest,
            [requestIp]: [requestObject],
        };
    }
    else {
        const currentInterval = [
            ...requestBucket[requestIp].filter((a) => a?.callID !== requestObject.callID),
            requestObject,
        ];
        requestBucket = {
            ...requestBucket,
            [requestIp]: currentInterval,
        };
    }
    return requestBucket;
};
const manageRequestFn = (params) => {
    const { callIDexists, currentRequestId, urlFn, interval, session } = params;
    let requestBody;
    const date = new Date();
    if (!callIDexists || !Object.keys(callIDexists).length) {
        requestBody = {
            requestIp: currentRequestId,
            requestObject: {
                callID: urlFn,
                request: session,
                ttl: interval,
                lastCall: +date,
            },
        };
    }
    else if (callIDexists.request === 1 &&
        date.getTime() - callIDexists.lastCall > interval) {
        requestBody = {
            requestIp: callIDexists.requestIp,
            requestObject: {
                callID: callIDexists.callID,
                request: session,
                ttl: callIDexists.ttl,
                lastCall: callIDexists.lastCall,
            },
        };
    }
    else {
        if (!callIDexists.request) {
            throw new Error(`TOO MANY REQUESTS: call ${urlFn} has too many requests try again in ${Math.floor(callIDexists.ttl / 60000)} minute(s)`);
        }
        else {
            const newRequestLimit = callIDexists.request - 1;
            requestBody = {
                requestIp: callIDexists.requestIp,
                requestObject: {
                    callID: callIDexists.callID,
                    request: newRequestLimit,
                    ttl: callIDexists.ttl,
                    lastCall: +date,
                },
            };
        }
    }
    return requestBody;
};
const limitCorefn = (args) => {
    let urlFn;
    const validUrl = ['graphql'];
    const { session_no, ttl, request } = args;
    const reqIsGraphql = validUrl.some((url) => regexCheck(url, request.baseUrl));
    if (reqIsGraphql) {
        const _req = Object.keys(request.body);
        if (_req.some((val) => ['query'].includes(val.toLocaleLowerCase()))) {
            urlFn = request.body[_req[0]].split(' ')[1].split('(')[0];
        }
    }
    else {
        urlFn = request.baseUrl;
    }
    const interval = ttl ?? Intervals.Query;
    const session = session_no ?? Intervals.request;
    const currentRequestId = `${request.ip}-${urlFn}`;
    const callIDexists = findRequestbyId({
        requestIp: currentRequestId,
        functionId: urlFn,
    });
    const requestBody = manageRequestFn({
        callIDexists,
        currentRequestId,
        interval,
        session,
        urlFn,
    });
    addRequestToList(requestBody);
};
exports.requestLimitCore = limitCorefn;
//# sourceMappingURL=index.js.map