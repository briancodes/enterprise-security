## Core Features Implementation

#### Auth Service

Uses a `factory` provider via `useFactory` to provide either a JWT or Cookie Sesison implementation depending on a config value

> Use this technique to create a dependency object with a factory function whose inputs are a **combination of injected services and local state** - [Angular Docs - useFactory](https://angular.io/guide/dependency-injection-in-action#factory-providers-usefactory)

Local state in this case is the config file value, and the injected dependency is the `HttpClient`

> Note: example is `AuthModule`, `AuthStrategy`, `AuthService`, could have used an `abstract class` instead of an `injection token` and an `interface`

#### Session Auth Strategy

`SessionAuthStrategy` class (doesn't need @Injectable as we provide via `useFactory`)

For this cookie bases strategy, if the user refershed, or uses new tab, we won't have user data so we call the server API to `GET` user, this will pass cookies by default, server will authenticate, and return the user object, which we store in the service

> we cannot access user data from the cookie even if we wanted to - think.... `HttpOnly`

#### JWT Auth Strategy

Stored in `localStorage` with `localStorage.setItem(JWT_Token, token)`

> This is not recommended by anyone - if XSS attach is successful your token is compromised

Should really be in a cookie, and make sure you have `CSRF` protection as well. See [Stormpath Blog - Where to Store JWT](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)

```
// API response
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsI.eyJpc3MiOiJodHRwczotcGxlL.mFrs3Zo8eaSNcxiNfvRh9dqKP4F1cB; Secure; HttpOnly;

// API request cookie attached automatically
Cookie: access_token=eyJhbGciOiJIUzI1NiIsI.eyJpc3MiOiJodHRwczotcGxlL.mFrs3Zo8eaSNcxiNfvRh9dqKP4F1cB;
```

Course author says that this **is not an ideal** implementation - as we don't check if it's a valid token (may be expired)

```
getCurrentUser(): Observable<User> {
    const token = this.getToken();
    if (token) {
      const encodedPayload = token.split('.')[1];
      const payload = window.atob(encodedPayload);
      return of(JSON.parse(payload));
    } else {
      return of(undefined);
    }
  }
```

#### Login Feature (node)

[Course Video Link](https://angular-academy.teachable.com/courses/751289/lectures/15180701)

#### Sign Up

#### Route Guards (canActivate)

#### Http Interceptors

- Auth Interceptor (adding JWT Authroizatio Bearer token)
- Error Interceptor

```javascript
constructor(private snackBar: MatSnackBar) {}

return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 3000,
            data: error.error.msg ?? "Unknown error",
        });

        return throwError(error);
    })
);
```