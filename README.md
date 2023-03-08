# Secure Credential Provision

This extension was developed within the scope of a bachelor thesis and only servers as proof of concept.

---

## What is the idea of Secure Credential Provision?

The experimental Firefox extension contributes to the secure provision of passwords when using the Firefox's password manager's **autofill feature** to enter credentials into web pages.

**How?**

**Short version**: The password manager only autofills dummy passwords and the extension replaces the dummy password with real password in the HTTP request.

**Long version**:
The LoginManagerChild only receives and autofills a dummy password into the login web page. The _passwordmgr-on-receive-credential-info_ browser event containing {id, realValue, dummyValue, origin} is dispatched from the LoginManagerParent. The extension listens for the extension event _onCredentialInfo_ that is fired by the experimental credentials API when the API gets notified about the _passwordmgr-on-receive-credential-info_ browser event. The extension saves the credential details in a storage. It listens as well for the _onBeforeRequest_ extension event by the webRequest API. That event provides the HTTP request bodies for the requests whose hosts match the origin associated with the saved credentials.

---

## Prerequisites

- You first need a special Firefox Nightly version that has the browser sided changes implemented. To install one follow the instructions provided in [X](www.example.com)

- To see what this proof of concept is trying to prevent, follow the [credentials theft exploit](https://github.com/1rneh/capture-credentials-exploit) step-by-step instruction. If you are running the customized Firefox Nightly version, make sure you visit [about:config](about:config) and set signon.secureCredentialProvision.enabled to false first.

## Installation steps

1. Clone this repository

2. Run the customized Firefox Nightly version.

3. Visit [about:config](about:config). Check that signon.secureCredentialProvision is set (back) to true if it was changed. \
   Also set the following preferences:

   - xpinstall.signatures.required to false
   - extensions.experiments.enabled to true

4. Visit [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) and load the extension as temporary add on by choosing the manifest.json file in the main repository directory.

5. Next to the extension name _Secure Credential Provision_ click "Inspect". Now you can repeat the [credentials theft exploit](https://github.com/1rneh/capture-credentials-exploit) or try a different login web page. Check out the logs that indicate that the extension has received credential information or modified a HTTP request body.
