const credStorage = CredentialStorage.getInstance();
//credStorage.fillWithDummyCredential();
let credentials = credStorage.credentials;
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

function scanRequestBody(requestDetails) {
  if (requestDetails.method == "POST" && requestDetails.requestBody) {
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
      let bodyToString = JSON.stringify(requestDetails.requestBody);
      let bodyModified = bodyToString.replace(
        matchingLogin.dummyValue,
        matchingLogin.realValue
      );
      if (bodyToString !== bodyModified) {
        requestDetails.requestBody = JSON.parse(bodyModified);
        console.log(
          "Dummy password replaced with real password in ",
          requestDetails
        );
      }
    }
  }
}

browser.webRequest.onBeforeRequest.addListener(
  scanRequestBody,
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

browser.experiments.credentials.onPasswordReceived.addListener((pw) =>
  console.log(pw)
);
