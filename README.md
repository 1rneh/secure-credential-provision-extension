# Secure Credential Provision

This experimental Firefox extension contributes to the secure provision of passwords when using the autofill feature by Firefox's password manager.

## What is the idea of Secure Credential Provision?

**Normal scenario:**\
Firefox loads a website and the password manager has credentials saved for this website. Usually the LoginManagerParent sends the login data to the LoginManagerChild, where the child interacts with the website content and autofills the credentials into the designated login fields.

**Secure Credential Provision:**\
The LoginManagerParent only sends a dummy value instead of the real password to the LoginManagerChild. When the login data is later submitted the HTTP request body is scanned for the dummy value and gets replaced with real password.

Why? Passwords are sensitive data and malicious code could be present on a website.

The web extension adds to event listeners for the following events:

- webRequest.onBeforeRequest
- experiments.credentials.onPassswordReceived (see Pre-requisites)

## Pre-requisites

1. If you have a local build of Firefox paste the following lines [here](https://searchfox.org/mozilla-central/source/toolkit/components/passwordmgr/LoginManagerParent.jsm#665) in LoginManagerParent.jsm, right before the return statement and then rebuild.

```
let infos = [];
jsLogins.forEach(login => {
  let info = {
    dummyId: `dummy-${login.username}-${login.origin}`,
    dummyPassword: "dummYpa$$word",
    realPassword: login.password,
    origin: login.origin
  };
  infos.push(info)
  login.password = info.dummyPassword
})
Services.obs.notifyObservers(null, "secure-credential-provision", JSON.stringify(infos));
```

2. On the new modified Firefox build, install the experimental API [experiments.credentials](https://github.com/1rneh/credentials-experimental-api) as temporary addon via _about:debugging_.

## Site notes

This web extension is part of a bachelor thesis and only serves as a proof of concept. **It does not properly work as web extention yet!**\
It has two web extension API dependencies that are not yet - maybe never will be - implemented.

1. It needs a credential API that fires an event (containing the real password) everytime the LoginManagerParent would send login data to the LoginManagerChild in order to autocomplete or autofill user credentials. The LoginManagerChild than only receives a dummy password, that is worthless to an attacker.
2. The webRequest API only offers modification of HTTP request header. For this extension the API would need the to be expanded with the option to modify request bodies as well.

**Limitations**\
In order for the web extension to find the password dummy value and replace it with the real one, the password dummy value needs to appear unencrypted, unencoded and unmodified in the HTTP request body.\
Another restriction is the request host. Only password dummy value is only replaced with the real value in requests that are send to a host that matches the origin, that the login was stored for in the password manager.
