class CredentialInfo {
  constructor(dummyId, dummyValue, realValue, origin) {
    this._id = dummyId;
    this._dummyValue = dummyValue;
    this._realValue = realValue;
    this._ttl = Date.now() + 60000; // time to live is set to timestamp at initialisation + 60s
    this._origin = origin;
  }

  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }
  get dummyValue() {
    return this._dummyValue;
  }
  set dummyValue(dummyValue) {
    this._dummyValue = dummyValue;
  }
  get realValue() {
    return this._realValue;
  }
  set realValue(realValue) {
    this._realValue = realValue;
  }
  get ttl() {
    return this._ttl;
  }
  set ttl(ttl) {
    this._ttl = ttl;
  }
  get origin() {
    return this._origin;
  }
  set origin(origin) {
    this._origin = origin;
  }
}
