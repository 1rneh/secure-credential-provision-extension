class CredentialInfo {
  constructor(dummyValue, realValue, allowedOrigin) {
    this.dummyValue = dummyValue;
    this.realValue = realValue;
    this.ttl = Date.now() + 60000; // The ttl is the timestamp when the CredentialInfo object is created + 60s
    this.allowedOrigin = allowedOrigin;
  }
}