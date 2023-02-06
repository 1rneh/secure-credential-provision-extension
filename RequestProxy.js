const credStorage = CredentialStorage.getInstance();
credStorage.fillWithDummyCredential();
let credentials = credStorage.credentials;

function checkRequestBody(requestDetails, login) {
  let bodyToString = JSON.stringify(requestDetails.requestBody);
  let bodyModified = bodyToString.replace(login.dummyValue, login.realValue);
  if (bodyToString !== bodyModified) {
    requestDetails.requestBody = JSON.parse(bodyModified);
    console.log(
      "Dummy password and replaced with real password.",
      requestDetails.requestBody
    );
  }
}
function isSameOrigin(requestOrigin, credentialOrigin) {
  const requestURL = new URL(requestOrigin);
  const loginURL = new URL(credentialOrigin);

  if (requestURL.origin === loginURL.origin) {
    return true;
  }
  const isHttpUgrade =
    loginURL.protocol === "http" && requestURL.protocol === "https";
  if (
    (isHttpUgrade || requestURL.protocol === loginURL.protocol) &&
    requestURL.hostname === loginURL.hostname &&
    requestURL.port === loginURL.port
  ) {
    return true;
  }
}
function isValidTTL(ttl) {
  return Date.now() < ttl;
}

function scanRequest(requestDetails) {
  if (requestDetails.method !== "POST") {
    return;
  }
  let matchingLogin;
  credentials.forEach((cred) => {
    if (
      isSameOrigin(requestDetails.url, cred.allowedOrigin) &&
      isValidTTL(cred.ttl)
    ) {
      matchingLogin = cred;
    }
  });
  if (matchingLogin) {
    checkRequestBody(requestDetails, matchingLogin);
  }
}

browser.webRequest.onBeforeRequest.addListener(
  scanRequest,
  {
    urls: ["<all_urls>"],
  },
  ["requestBody", "blocking"]
);
