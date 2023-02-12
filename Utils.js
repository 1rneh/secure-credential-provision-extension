const credentialStorage = CredentialStorage.instance;

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

function modifyRequestBody(requestBody, dummyPassword, realPassword) {
  let bodyToString = JSON.stringify(requestBody);
  let bodyModified = bodyToString.replace(dummyPassword, realPassword);
  return body
}
