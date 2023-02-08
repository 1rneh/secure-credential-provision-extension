# Secure Credentials Extension

This experimental web extension contributes to the secure provision of passwords when using the autofill feature by Firefox's password manager.

Approach:\
A website is loaded and the password manager is about to autofill the password field. Instead of autofilling the real password, a dummy value is filled in the password field and the event `secure-credential-provision` is fired, containing the real-password.\
Protoype:\
Paste the next line into [this line of LoginManagerParent.jsm of mozilla central](https://searchfox.org/mozilla-central/source/toolkit/components/passwordmgr/LoginManagerParent.jsm#665)

```
Services.obs.notifyObservers(null, "secure-credential-provision","realPassword");
```

This event is created by the experimental extension API `experiments.credentials`.The web extension that contains the experimental API registers two event listeners:

- webRequest.onBeforeRequest
- experiments.credentials.onPassswordReceived

First the extension receives the real password and then intercepts the HTTP requests going to the "correct" web server and and scans them for the dummy value. If found the dummy value is found, it gets replaced by the real value.

## Site notes

This web extension is part of a bachelor thesis and only serves as a proof of concept. **It does not properly work as web extention yet!**\
It has two Extension API dependencies that are not yet - maybe never will be - implemented.

1. needs a Credential API that fires an event (containing the real password) everytime the password manager would autocomplete or autofill user credentials into username and password fields. Then the password manager needs to write the password dummy value into the password field.
2. The webRequest API offers requestHeader modification but the requestBody can not be modified and returned yet.

**Limitation:** In order for the web extension to find the dummy value and replace it with the real one, the value _passwordDummy_ needs to appear unencrypted and unmodified in the requestBody. Another restriction is the origin. Only requests that are send to the same origin as the domain that the login was stored for are given access to the real password.
