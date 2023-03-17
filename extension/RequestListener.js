const MODIFIED_RAW = {};
const MODIFIED_FORMDATA = {};
const UNMODIFIED = {};

let modifiedBodies = new Map();

/**
 * Convert the bytes to string and check if the dummy value is found.
 * If so, replace the dummy value with the real value.
 *
 * (If the request body was encoded by a type that the webRequest API didn't support,
 * the webRequest API sends the unparsed bytes in an ArrayBuffer)
 *
 * @param {ArrayBuffer} buf
 * @param {CredentialInfo} matchingLogin
 * @returns {Object} bodyStatus (MODIEFIED_RAW, MODIFIED_FORMDATA or UNMODIFIED) and either the modified requestBody or null
 */
function processRawBytes(buf, matchingLogin) {
  let bytesToString;

  try {
    bytesToString = ab2str(buf);
  } catch (e) {
    console.log("Error while converting bytes to string", e);
  }

  if (!bytesToString.includes(matchingLogin.dummyValue)) {
    return { bodyStatus: UNMODIFIED, data: null };
  }
  console.log("Found dummy value in raw string: ", bytesToString);
  let modifiedStr = bytesToString.replace(
    matchingLogin.dummyValue,
    matchingLogin.realValue
  );

  let modifiedRawBytes;
  try {
    modifiedRawBytes = str2ab(modifiedStr);
  } catch (e) {
    console.log("Error while converting string back to bytes", e);
  }
  return { bodyStatus: MODIFIED_RAW, data: modifiedRawBytes };
}

/**
 * Check if the dummy value is found. If so, replace the dummy value with the real value.
 *
 * (If the request body was encoded by the types application/x-www-form-urlencoded or multipart/form-data
 * it parses the request body correctly)
 *
 * @param {Object} data
 * @param {CredentialInfo} matchingLogin
 * @returns {Object} bodyStatus (MODIEFIED_RAW, MODIFIED_FORMDATA or UNMODIFIED) and either the modified requestBody or null
 */
function processFormData(data, matchingLogin) {
  let bodyToString = JSON.stringify(data);

  if (!bodyToString.includes(matchingLogin.dummyValue)) {
    return { bodyStatus: UNMODIFIED, data: null };
  }
  let bodyModified = bodyToString.replace(
    matchingLogin.dummyValue,
    matchingLogin.realValue
  );
  let modifiedFormData = JSON.parse(bodyModified);

  return { bodyStatus: MODIFIED_FORMDATA, data: modifiedFormData };
}

/**
 * Checks whether the request is sent to the same origin
 * If so either call processFormData if the webRequest API parsed the request body correctly
 * Or call processRawBytes if the API failed to parse the form data due to not supporting the encoding type
 *
 * @param {Object} requestDetails, relevant informatioin are requestDetails.requestBody and requestDetails.url
 * @returns {Object} modified request body if the dummy value was found (in theory)
 */
function processOnBeforeRequest(requestDetails) {
  if (requestDetails.method == "POST" && requestDetails.requestBody) {
    let matchingLogin;
    credentialStorage.credentials.forEach((cred) => {
      if (isSameOrigin(requestDetails.url, cred.origin)) {
        matchingLogin = cred;
      }
    });
    if (matchingLogin) {
      console.log("Scanning body...", requestDetails.requestBody);

      let res;
      if (requestDetails.requestBody?.raw) {
        res = processRawBytes(
          requestDetails.requestBody.raw[0].bytes,
          matchingLogin
        );
      } else if (requestDetails.requestBody?.formData) {
        res = processFormData(
          requestDetails.requestBody.formData,
          matchingLogin
        );
      } else if (requestDetails.requestBody?.error) {
        return;
      }

      switch (res?.bodyStatus) {
        case UNMODIFIED:
          break;
        case MODIFIED_RAW:
          requestDetails.requestBody.raw[0].bytes = res.data;
          console.log("Modified raw byte data: ", ab2str(res.data));
          credentialStorage.removeCredentialInfo(matchingLogin.id);
          break;
        case MODIFIED_FORMDATA:
          requestDetails.requestBody.formData = res.data;
          console.log("Modified form data: ", res.data);
          break;
      }
    }
  }
}

/**
 * Adds an event listener for the extension event onBeforeRequest
 * with the callback function processOnBeforeRequest, a URL filter that let's through every event and a request to include the request body in the request details
 */
browser.webRequest.onBeforeRequest.addListener(
  processOnBeforeRequest,
  { urls: ["<all_urls>"] },
  ["requestBody"] //["blocking"] for making the request synchronously to modify the requestBody
);
