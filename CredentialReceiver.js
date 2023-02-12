function processOnCredentialInfos(credentialDetails) {
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

browser.experiments.credentials.onCredentialInfos.addListener(
  processOnCredentialInfos
);
