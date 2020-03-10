# Module 1 - Setup and Introduction

Requierments and introduction to course

# Module 2 - Web Security Model

## Same-origin Policy (SOP)

- default policy (irrespective of CORS)
- mechanism controlled by the server via headers, and enforced by the client e.g. Chrome Browser
- optionally enforced e.g. Postman doesn't enforce
- applies to `XHR` and `fetch`
- doesn't apply to `<script src="">` or `<link rel="stylesheet" href="">`

Ref: https://medium.com/@baphemot/understanding-cors-18ad6b478e2b

#### Origin: 

- The `origin` is all three of the following together:
    1. [`URI scheme/protocol`]https://
    1. [`sub-domain/host/domain`]example.com
    1. [`port`] :443

Ref: https://en.wikipedia.org/wiki/Same-origin_policy

#### Browsers

- `same-origin policy` isolates the client-server from other isolated browser tabs
- Isolated tabs cannot utilize resourses e.g memory, localStorage, cookies
    - localStorage works accross tabs that are of the same-origin 
    - cookies are attached to an origin, accross tabs


#### Blocked Response

Cross-origin requests (fetch, XHRHttpRequest) can be made, but browser will block response 

> Error: No Acces-Control-Allow-Origin header is present on requested resource

It's the browser that blocks the response - by checking the `Access-Control-Allow-Origin` header

## Cross-origin Resource Sharing (CORS)

Used by the requested server to relax the SOP enforced by browsers

Server running on `8081` in cross site request from `8080` might set: 

```javascript
app.use(cors({origin: 'http://127.0.0.1:8080'}))
```
`Response Headers` would then include `Access-Control-Allow-Origin: http://127.0.0.1:8080`, and browser would allow the response to be returned

#### Credentials Include

Making a cross origin request (fetch) does not send cookies by default. To send cookies requires the `credentials: include` header

- https://javascript.info/fetch-crossorigin#credentials

```javascript
fetch('http://another.com', {
  credentials: "include"
});
```
This will result in a `pre-flight` request

> If the server agrees to accept the request with credentials, it should add a header `Access-Control-Allow-Credentials: true` to the response, in addition to `Access-Control-Allow-Origin`

> `Access-Control-Allow-Origin` is prohibited from using a star `*` for requests with credentials. Like shown above, it must provide the exact origin there. That’s an additional safety measure, to ensure that the server really knows who it trusts to make such requests. 

## Content Security Policy

Needs to be implemented by the server, otherwise it's off by default

A good starting point is from 
- https://content-security-policy.com/

```html
default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';
```

Node: `helmet-csp`. Adds `Content-Security-Policy` headers directing the browser to block inline-script/styes from running, and also cross-origin images, styles, scripts etc respones from being read

> inline refers to `<script>console.log('inline')</script>` and `<style>body {margin: 0;}</style>`

```javascript
app.use(csp({
    directives: {
        defaultSrc: ["'self'"], 
        // any inline is considered "unsafe", can allow with
        // styleSrc/scriptSrc: ["'unsafe-inline'"] 
        // inline disabled, allow <link href> from self and cross origin
        styleSrc: ["'self'", "'http://127.0.0.1:8081'"]
        // inline disabled, allow <script src> from self and cross origin
        scriptSrc: ["'self'", "'http://127.0.0.1:8081'"]
    }
}))

// Response Header: 
// Content-Security-Policy: default-src 'self'; style-src 'self' 'http://12..
```

Loading a cross origin styles without the orign domain in `styleSrc` would result in: 

> Error: Refused to apply inline-style...violates CSP directive `default-src 'self'`. Note: `style-src` was not explicitly used so fallback to `default-src`

> Network Tab for cross-origin css/js files: `Blocked (CSP)`

#### CSP: Allow Inline Without `unsafe-inline`

- hash sha
 - inline script generate at hash, add this to `scriptSrc`
- nonce
 - add `nonce-3534535` to the script tag and `script-src`
 - `Content-Security-Policy: script-src nonce-xxx;`

## Subresource Integrity

```html
<script 
    src="https://example.com/example-framework.js"
    integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+"
    crossorigin="anonymous">
</script>
```

> For subresource-integrity verification of a resource served from an origin other than the document in which it's embedded, browsers additionally check the resource using Cross-Origin Resource Sharing (CORS), to ensure the origin serving the resource allows it to be shared with the requesting origin. Therefore, the resource must be served with an Access-Control-Allow-Origin header that allows the resource to be shared with the requesting origin
- https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity


#### Angular Subresource Integrity

`ng build --subresource-integrity`

```html
<script
  type="text/javascript"
  src="runtime.js"
  integrity="sha384-l2idrIRRBrjHbp+jErEfqKMlALJ8XhHO2xWq/3wCMAE2uO8I7Wv+yu2yKsG+"
  crossorigin="anonymous">
</script>
```



