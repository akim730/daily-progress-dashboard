# Secure Upload Instructions

This dashboard is a static GitHub Pages app. Because GitHub Pages exposes the front-end to everyone, browser-only upload restrictions are only a client-side guard and are not a secure server-side control.

## What this file does

The repository includes `secure-upload.js`, which:

- hides upload access by default
- requires a password before enabling uploads
- stores the authorization in browser localStorage
- blocks the upload action if the user is not authorized

## Required setup

Add the following script tag near the end of `index.html`, before the closing `</body>` tag:

```html
<script src="./secure-upload.js"></script>
```

Then change the upload trigger to use the guarded control flow. The script automatically injects a lock button and a restricted upload label if the page still uses the original elements.

## Important limitation

This is a front-end protection only. To truly restrict who can upload, the upload logic must move to a private backend or authenticated Google Apps Script endpoint.

For production-grade security, implement:

- authentication for the uploader
- a server-side verification step
- a secret token or signed request
- no public direct file upload from the browser

## Password

Update the password in `secure-upload.js` before deployment:

```js
const ADMIN_UPLOAD_PASSWORD = 'CHANGE_ME_TO_A_STRONG_PASSWORD';
```
