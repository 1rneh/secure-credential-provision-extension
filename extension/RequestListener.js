const MODIFIED_RAW = {};
const MODIFIED_FORMDATA = {};
const UNMODIFIED = {};

function processRawBytes(buf, matchingLogin) {
  let bytesToString;

  try {
    bytesToString = ab2str(buf);
  } catch (e) {
    console.log("Error while converting bytes to string", e);
  }

  if (!bytesToString.includes(matchingLogin.dummyValue)) {
    return { bodyType: UNMODIFIED, data: null };
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
  return { bodyType: MODIFIED_RAW, data: modifiedRawBytes };
}

function processFormData(data, matchingLogin) {
  let bodyToString = JSON.stringify(data);

  if (!bodyToString.includes(matchingLogin.dummyValue)) {
    return { bodyType: UNMODIFIED, data: null };
  }
  let bodyModified = bodyToString.replace(
    matchingLogin.dummyValue,
    matchingLogin.realValue
  );
  let modifiedFormData = JSON.parse(bodyModified);

  return { bodyType: MODIFIED_FORMDATA, data: modifiedFormData };
}

function scanRequestBody(requestDetails) {
  if (requestDetails.method == "POST" && requestDetails.requestBody) {
    let matchingLogin;
    credentialStorage.credentials.forEach((cred) => {
      if (isValidHost(requestDetails.url, cred.origin)) {
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
      } else {
        return;
      }

      switch (res?.bodyType) {
        case UNMODIFIED:
        //console.log("Body unmodified.");
        case MODIFIED_RAW:
          requestDetails.requestBody.raw[0].bytes = res.data;
          console.log("Modified raw byte data: ", ab2str(res.data));
          credentialStorage.removeCredentialInfo(matchingLogin.id);
        case MODIFIED_FORMDATA:
          requestDetails.requestBody.formData = res.data;
          console.log("Modified form data: ", res.data);
      }
    }
  }
}

browser.webRequest.onBeforeRequest.addListener(
  scanRequestBody,
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
