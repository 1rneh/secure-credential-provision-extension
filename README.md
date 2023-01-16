# Secure Credentials Extension

This web extension helps a user keep their passwords save when loggin into a website. When logging into a web account and using a password manager fill in _passwordDummy_ into the passwordField. The HTTP Request is then scanned for the dummy value and replaced by the real credential, if the host from the header equals the login origin, for which the password was saved for.

**NOTE:**
This web extension is part of my bachelor thesis and does not work as web extention yet. It has two Extension API dependencies that are not yet - maybe never will be - implemented.

1. needs an Credential API that fires an event everytime a password manager would autocomplete or autofill user credentials into username and password fields. The value _passwordDummy_ is filled into the password field and the real credentials are included as object into the event, that is fired.
2. The webRequest API offers requestHeader modification but the requestBody can not be modified yet.

## Usage

Whenever you login on a website and you want your password not to be sniffed on.

**Limitation:** In order for the web extension to find the dummy value and replace it with the real one, the value _passwordDummy_ needs to appear unencrypted and unmodified in the requestBody. Another restriction is the origin. Only requests that are send to the same origin as the domain that the login was stored for are given access to the real password.
