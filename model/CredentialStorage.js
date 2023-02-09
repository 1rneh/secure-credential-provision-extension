class CredentialStorage {
  constructor() {
    this.credentials = new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CredentialStorage();
    }
    return this.instance;
  }

  fillWithDummyCredential() {
    const dummyCredentials1 = new CredentialInfo(
      "passwordDummy",
      "realValue",
      "https://www.chess.com"
    );
    this.credentials.set(dummyCredentials1.allowedOrigin, dummyCredentials1);
    const dummyCredentials2 = new CredentialInfo(
      "passwordDummy",
      "realValue",
      "http://localhost:5000"
    );
    this.credentials.set(dummyCredentials2.allowedOrigin, dummyCredentials2);
  }
}
