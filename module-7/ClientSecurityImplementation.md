## Client Security Implementation

## XSS Prevention

This is generally accomplished by Angulars default binding `sanitization`, and via **server side** `Content-Security-Policy` headers

There is also a mechanism to apply CSP directly via the frontend code:

```javascript
<head>
  <meta charset="utf-8">
  <title>Budget</title>

  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    connect-src 'self';
    font-src data:;
    style-src 'self' 'unsafe-inline'">

  <!-- can't be used for frame-ancestors, report-uri, or sandbox -->

</head>
```

> Note: `connect-src 'self'` restricts XHR calls

## CSRF/XSRF

`SameSite Lax` with `HttpOnly` on our `session_id` would cover most cases and browsers e.g. click on malicious `POST` navigation link or `form` will not attach `cookies`

- still, there are browsers that don't support `SameSite`

To cover (almost) all other cases we can use `XSRF-Token` token mechanism

`Angular Implementation`
```javascript
HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-Token',
      headerName: 'XSRF-Token',
    }),
```

> [HttpClientXsrfModule Angular Source](https://github.com/angular/angular/blob/master/packages/common/http/src/xsrf.ts)

`Node Implementation`
```javascript
import session = require('express-session');
import * as csrf from 'csurf';

// Requires express-session to be used first
app.use(session(config.sessionConfig));
app.use(csrf());
app.use(csrfCookieSetter());

// Custom middleware
export const csrfCookieSetter = () => (req: Request, res: Response, next: NextFunction) => {
    // Will be on the req.csrfToken() thanks to `csurf`
    res.cookie('XSRF-Token', req.csrfToken());
    next();
}
```

1. Server adds `XSRF-Token=abc` cookie (non-HttpOnly) to responses
1. Angular imports `HttpClientXsrfModule` module and optionally set cookie/token names
1. Angular intercepts all non `GET/HEAD` XHR requests with [HttpXsrfInterceptor](https://github.com/angular/angular/blob/9.1.1/packages/common/http/src/xsrf.ts#L70), reads `XSRF-Token` cookie and adds to header 

> Edit the `XSRF-Token` cookie in DevTools `Application` tab to see it failing

#### HttpOnly & Secure

- HttpOnly cookies cannot be read by JavaScript in the browser
- Secure enables the cookies only in HTTPS protocols

#### Authenticate User

Angular - `session-auth.strategy.ts` and `jwt-auth.strategy.ts`

Node - `session-auth.service.ts` methods `authenticate` and `login`

> Keep in mind, `express-session` simply creates a session store and session cookie, we need to add the `session.user` to associate a logged in user with the session e.g. an unauthenticated user will also have a session

When the user logs out the `session` is destroyed - as in the `user` object is removed from the session (but the `session_id` is still in the store and on the cookie)

```javascript
logout(session: any): Promise<void> {
    if (session && session.destroy) {
        return new Promise((resolve) => {
        session.destroy(() => resolve());
        });
    } else {
        return Promise.resolve();
    }
}
```

#### Conditional Component Visibility

Custom `*ngIf`, which is similar, but not as cool as my own implementation 😊

- https://github.com/briancodes/ngx-if-expression