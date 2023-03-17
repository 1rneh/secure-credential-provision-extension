/**
 * CredentialStorage storing all CredentialInfo objects for 60 seconds
 */

class CredentialStorage {
  constructor() {
    this._credentials = new Map();
  }
  /**
   * Singleton implementation of CredentialStorage
   */
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
    this.cleanUp();
    this._credentials = credentials;
  }

  saveCredentialInfo(id, login) {
    if (this.credentials.has(id)) {
      console.log(`Updating the ttl for the CredentialInfo with id=${id}`);
    } else {
      console.log(`CredentialInfo saved with id=${id}`);
    }
    this.credentials.set(id, login);
  }

  removeCredentialInfo(id) {
    this.credentials.delete(id);
  }

  /**
   * Removes the CredentialInfo entries from the CredentialStorage, for which the lifespan (ttl) has expired
   */
  cleanUp() {
    this.credentials = new Map(
      [...this.credentials].filter(([_, v]) => v.ttl > Date.now())
    );
  }
}
