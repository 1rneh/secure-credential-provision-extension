const credentialStorage = CredentialStorage.instance;

function getBaseDomain(hostname) {
  const parts = hostname.split(".");
  const tld = parts[parts.length - 1];
  const domain = parts[parts.length - 2];
  return domain + "." + tld;
}

// following rules of LoginHelper.isOriginMatching (https://searchfox.org/mozilla-central/source/toolkit/components/passwordmgr/LoginHelper.jsm#727)
function isValidHost(requestHost, credentialOrigin) {
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
function isValidTTL(ttl) {
  return Date.now() < ttl;
}

// https://gist.github.com/skratchdot/e095036fad80597f1c1a
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
