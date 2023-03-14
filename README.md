# Secure Credential Provision

This extension was developed within the scope of my bachelor thesis. To test the extension you need a [Firefox Nightly Build for Secure Credential Provision](https://github.com/1rneh/secure-credential-provision-extension#readme). This setup only servers as proof of concept.

---

## What is the idea of Secure Credential Provision?

The experimental Firefox extension contributes to the secure provision of passwords when using the Firefox's password manager's **autofill feature** to enter credentials into web pages.

**How?**

**Short version**: The password manager only autofills dummy passwords and the extension replaces the dummy password with the real password in the outgoing HTTP request body.

**Detailed version**:
The LoginManagerChild only receives and autofills a dummy password into the login web page. The _passwordmgr-on-receive-credential-info_ browser event containing {id, realValue, dummyValue, origin} is dispatched from the LoginManagerParent. The extension listens for the extension event _onCredentialInfo_ that is fired by the experimental credentials API when the API gets notified about the _passwordmgr-on-receive-credential-info_ browser event. The extension saves the credential details in a storage. It listens as well for the _onBeforeRequest_ extension event by the webRequest API. That event provides the HTTP request bodies for the requests whose hosts match the origin associated with the saved credentials.

---

## Installation steps

1. Install and run the [Firefox Nightly Build for Secure Credential Provision](https://github.com/1rneh/firefox-nightly-builds-secure-credential-provision)

2. Type `about:config` into the search bar and set the following preference:

   - signon.secureCredentialProvision to true
   - xpinstall.signatures.required to false
   - extensions.experiments.enabled to true

3. Clone this repository

4. Type `about:debugging#/runtime/this-firefox` into the search bar.

5. Load the extension as temporary add on by choosing the manifest.json file in the main repository directory.

6. Next to the newly added extension with the name _Secure Credential Provision_ click "Inspect" to check out the extension.

7. Now you can execute the [credentials theft exploit](https://github.com/1rneh/capture-credentials-exploit) or try a different login web page. Check out the logs that indicate that the extension has received credential information or modified a HTTP request body.

8. Optional: Repeat the credential theft exploit but without the prototype changes. Set `extensions.experiments.enabled` to false for this.
