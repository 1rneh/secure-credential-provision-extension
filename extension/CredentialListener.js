/**
 * Parses the credential deatials, create an CredentialInfo object and and stores it in the CredentialStorage
 *
 * @param {String} credentialDetails containing {dummyId, dummyPassword, realPassword, origin}
 */
function processOnCredentialInfo(credentialDetails) {
  if (credentialDetails) {
    JSON.parse(credentialDetails).forEach((info) => {
      let credentialInfo = new CredentialInfo(
        info.dummyId,
        info.dummyPassword,
        info.realPassword,
        info.origin
      );
      CredentialStorage.instance.saveCredentialInfo(
        info.dummyId,
        credentialInfo
      );
    });
  }
}

/**
 * Adds an event listener for the extension event onCredentialInfo
 * with the callback function processOnCredentialInfo
 */
browser.experiments.credentials.onCredentialInfo.addListener(
  processOnCredentialInfo
);
