const credentialStorage = CredentialStorage.instance;

/**
 * Get base domain for an URL
 * (e.g. login.example.com -> example.com)
 *
 * @param {String} url
 * @returns the base fomain for the host
 */
function getBaseDomain(url) {
  const parts = url.split(".");
  const tld = parts[parts.length - 1];
  const domain = parts[parts.length - 2];
  return domain + "." + tld;
}

/**
 * Checks whether the request host origin and the origin for which the CredentialInfo object was stored for are the same. Subdomains are accepted.
 * (following the example of LoginHelper.isOriginMatching, see https://searchfox.org/mozilla-central/source/toolkit/components/passwordmgr/LoginHelper.jsm)
 *
 * @param {String} requestHost the host that the request is begin sent to
 * @param {String} credentialOrigin the origin that the CredentialInfo object is stored for
 * @returns whether the two origins are considered same origin
 */
function isSameOrigin(requestHost, credentialOrigin) {
  const requestURL = new URL(requestHost);
  const loginURL = new URL(credentialOrigin);

  if (requestURL.origin === loginURL.origin) {
    return true;
  }
  const isSchemeUgrade =
    loginURL.protocol === "http" && requestURL.protocol === "https";
  if (
    (isSchemeUgrade || requestURL.protocol === loginURL.protocol) &&
    getBaseDomain(requestURL.hostname) === getBaseDomain(loginURL.hostname) &&
    requestURL.port === loginURL.port
  ) {
    return true;
  }
}

//
/**
 * Converts a string to an ArrayBuffer
 * (Taken from https://gist.github.com/skratchdot/e095036fad80597f1c1a)
 *
 * @param {String} str modified request body as string
 * @returns {ArrayBuffer} bytes for modified request body data
 */
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * Converts bytes from an ArrayBuffer to a string
 * (Taken from https://gist.github.com/skratchdot/e095036fad80597f1c1a)
 *
 * @param {ArrayBuffer} buf raw bytes of request body data
 * @returns {String} request body data as string
 */
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
