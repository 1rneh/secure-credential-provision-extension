function scanRequestBody(requestDetails) {
  if (requestDetails.method == "POST" && requestDetails.requestBody) {
    let matchingLogin;
    credentialStorage.cleanUp();
    credentialStorage.credentials.forEach((cred) => {
      if (
        isSameOrigin(requestDetails.url, cred.origin) &&
        isValidTTL(cred.ttl)
      ) {
        matchingLogin = cred;
      }
    });
    if (matchingLogin) {
      let bodyToString = JSON.stringify(requestDetails.requestBody);
      let bodyModified = bodyToString.replace(
        matchingLogin.dummyValue,
        matchingLogin.realValue
      );
      if (bodyToString !== bodyModified) {
        requestDetails.requestBody = JSON.parse(bodyModified);
        console.log(
          "Dummy password replaced with real password. Result request: ",
          requestDetails
        );
        credentialStorage.removeCredentialInfo(matchingLogin.id);
        console.log(`Removed credentials for id: ${matchingLogin.id}`);
      } else {
        console.log(
          "Fitting request found, but no dummy password: ",
          requestDetails
        );
      }
    }
  }
}

browser.webRequest.onBeforeRequest.addListener(
  scanRequestBody,
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
