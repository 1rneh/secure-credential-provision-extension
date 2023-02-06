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
    const dummyCredential = new CredentialInfo(
      "passwordDummy",
      "realValue",
      "https://www.chess.com"
    );
    this.credentials.set(dummyCredential.allowedOrigin, dummyCredential);
  }
}

browser.experiments.credentials.onPasswordReceived((pw) => {
  console.log(`Got something: ${pw}`);
});
