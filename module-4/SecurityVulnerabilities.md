# Security Vulnerabilities

[Course Link](https://angular-academy.teachable.com/courses/751289/lectures/14570173)

See the forked repo of [security course labs](https://github.com/briancodes/security-course-labs/tree/feature/local-example)

## OWASP Top 10

> Repository with common and popular passwords:

https://github.com/danielmiessler/SecLists/tree/master/Passwords

1. SQL Injection 

    - validate and sanitize all user input (client and server)

2. Broken Authentication 
    - limit failed login attempts (prevent brute force)
    - strongly hashed password storage
    - impose password complexity rules (within reason for UX)
    - compare with password repo

3. Sensitive Data Exposure
    - HTTPS 

4. XML External Entitites

5. Broken Access Control
    - entity ownership
    - entity authorization (roles)

6. Security Misconfiguration 
    - default accounts/passwords e.g user/pwd: admin
    - default erros/error-pages: server version given

7. Cross-site Scripting (XSS)
    - malicious code executed in the context of the website in users browser
    - according to Angular Academy, it's basically **GAME OVER**

8. Insecure Deserialization 
    - hash secured cookie data
    - insures it's integrity (not manipulated on the client side)

9. Components with Known Vulnerabilities
    - `npm` is a good example
    - `npm audit`, `npm audit fix`

10. Insufficient Logging and Monitoring
    - unnoticed data breach
    - auditable events not logged e.g. failed logins
    - logs not monitored for suspicious activity

## Cross-site Scripting (XSS)

1. Stored (comment, markdown)
1. Reflected (url with malicious query params e.g. not originating from code or server)

Can occur at runtime (DOM based) or server side e.g. during HTML page rendering

> Angular sanitizes binding but can be bypassed: `[innerHTML]=sanitizer.bypassSecurityTrustHTML(value)`. Applying parsed *markdown* content might use this technique - which is inherently risky

#### Examples on GitHub

Stored XSS - comment saved to DB with `<img onerror="...">`, prevented with default binding sanitization, and also bypassing sanitization but using `Content Secutiry Policy: script-src self;`

Reflected XSS - search term query param that's read and rendered in the DOM (prevented with default binding sanitization)

[Link to Source](https://github.com/bartosz-io/security-course-labs/blob/master/angular/projects/xss/src/app/app.component.ts)

## Cross Site Request Forgery (CSRF)

XHR's don't send cookies cross-site (without `withCredentials/credentials: include` and co-op betweeen client/server) so SameSite works targets navigation and links

#### Navigation and Form Submit

Cookies with `SameSite=Strict;` prevent cross-site `<form>` from sending cookies
```
<form action="http://127.0.0.1/transfer" method="post">
```

Using `SameSite=Lax` allows the cookies to be sent if API endpoint is a `GET` (not a POST/PUT) and the **address bar location** changes
```
<a href="http://127.0.0.1/transfer/mr-hacker/10000">GET HERE</a>
``` 
