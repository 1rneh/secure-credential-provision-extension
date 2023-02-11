class CredentialStorage {
  constructor() {
    this._credentials = new Map();
  }
  static get instance() {
    if (!this._instance) {
      this._instance = new CredentialStorage();
    }
    return this._instance;
  }
  get credentials() {
    return this._credentials;
  }

  set credentials(credentials) {
    this._credentials = credentials;
  }

  saveCredentialInfo(id, login) {
    if (this.credentials.has(id)) {
      console.log(`Updating credentials of id=${id}`);
    } else {
      console.log(`Credentials saved of id=${id}`);
    }
    this.credentials.set(id, login);
  }

  removeCredentialInfo(id) {
    this.credentials.delete(id);
  }

  /**
   * Removes the credentialInfo entries (this.credentials) which are no longer valid, because the time-to-live has passed
   */
  cleanUp() {
    this.credentials = new Map(
      [...this.credentials].filter(([_, v]) => v.ttl > Date.now())
    );
  }
}
