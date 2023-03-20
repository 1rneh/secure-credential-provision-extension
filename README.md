# Secure Credential Provision

This extension was developed within the scope of my bachelor thesis. To test the extension you need a [Firefox Nightly Build for Secure Credential Provision](https://github.com/1rneh/secure-credential-provision-extension#readme). This setup only servers as proof of concept.

---

## What is the idea of Secure Credential Provision?

The experimental Firefox extension contributes to the secure provision of passwords when using the Firefox's password manager's **autofill feature** to enter credentials into web pages.

**How?**

**Short version**: The password manager only autofills dummy passwords and the extension replaces the dummy password with the real password in the outgoing HTTP request body.

**Detailed version**:
The LoginManagerChild only receives and autofills a dummy password into the login web page. The _passwordmgr-on-receive-credential-info_ browser event containing {id, realValue, dummyValue, origin} is dispatched from the LoginManagerParent. The extension listens for the extension event _onCredentialInfo_ that is fired by the experimental credentials API when the API gets notified about the _passwordmgr-on-receive-credential-info_ browser event. The extension saves the credential details in a storage. It also listens for the _onBeforeRequest_ extension event by the webRequest API. That event provides the HTTP request bodies for the requests whose hosts match the origin associated with the saved credentials.

---

The prototype was tested on 100 web applications, see the [test results](https://github.com/1rneh/secure-credential-provision-extension/tree/main/test-results).

---

## Installation steps

1. Install and run the [Firefox Nightly Build for Secure Credential Provision](https://github.com/1rneh/firefox-nightly-builds-secure-credential-provision)

2. Type `about:config` into the search bar and set the following preferences:

   - `signon.secureCredentialProvision` to true
   - `xpinstall.signatures.required` to false
   - `extensions.experiments.enabled` to true

3. Clone this repository

4. Type into the search bar:

```
about:debugging#/runtime/this-firefox
```

5. Click "Load Temporary Add-on..."

6. Select the manifest.json file in the main directory of the repository.

7. Next to the newly added extension with the name _Secure Credential Provision_ click "Inspect"

This Toolbox is to check out the log messages from the extension in the Console Tab that indicate that the extension has received credential information or modified a HTTP request body. They should look like [these example logs](https://github.com/1rneh/secure-credential-provision-extension/tree/main/test-results) (when you are testing the prototype).\
To see the network traffic (e.g. the fetch request exfiltrating the user password) use the regular Web Developer Toolbox and check the Network Tab

8. You can repeat the [credentials theft exploit](https://github.com/1rneh/capture-credentials-exploit) or try out the adapted autofill process on any other login page. (See the test results for web applications where it should work: [Secure Credential Provision results](./Secure_Credential_Provision_Test_Results.pdf))

Set `extensions.experiments.enabled` to false, to check out the regular autofill process or to repeat the [credentials theft exploit](https://github.com/1rneh/capture-credentials-exploit) without the prototype changes.
