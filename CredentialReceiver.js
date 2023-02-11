function checkOnPasswordReceived(loginObject) {
  if (loginObject) {
    let loginInfos = JSON.parse(loginObject);
    loginInfos.forEach((info) => {
      let credentialInfo = new CredentialInfo(
        info.dummyId,
        info.dummyPassword,
        info.password,
        info.origin
      );
      CredentialStorage.instance.saveCredentialInfo(info.dummyId, credentialInfo);
    });
  }
}

browser.experiments.credentials.onPasswordReceived.addListener(
  checkOnPasswordReceived
);