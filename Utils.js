const credentialStorage = CredentialStorage.instance;

function ignoreWWW(url) {
  return url.replace(/:\/\/www./g, "://");
}

function isSameOrigin(requestOrigin, loginOrigin) {
  return ignoreWWW(requestOrigin) === ignoreWWW(loginOrigin);
}
function isSameHostname(requestHostname, loginHostname) {
  return ignoreWWW(requestHostname) === ignoreWWW(loginHostname);
}

function isValidHost(requestHost, credentialOrigin) {
  const requestURL = new URL(requestHost);
  const loginURL = new URL(credentialOrigin);

  if (isSameOrigin(requestURL.origin, loginURL.origin)) {
    return true;
  }
  const isHttpUgrade =
    loginURL.protocol === "http" && requestURL.protocol === "https";
  if (
    (isHttpUgrade || requestURL.protocol === loginURL.protocol) &&
    isSameHostname(requestURL.hostname, loginURL.hostname) &&
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
  return body;
}
