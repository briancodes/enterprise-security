# Module 3 - Client vs Server Security

## Client Security Boundaries

`Set-Cookie: session_id=123; Secure; HttpOnly; SameSite=Strict`

- Secure: HTTPS only
- HttpOnly: cookie cannot be read by JavaScript
- SameSite=None/Strict/Lax
    - None: same-site + cross-site
    - Strict: same-site
    - Lax: same-site + cross-site (cross-site on condition)
        - Condition 1: location changes e.g. address bar updates, not AJAX call
        - Condition 2: GET, HEAD, TRACE, OPTIONS e.g. not POST or PUT

#### Server Side Validation

Always assume the UI is compromised and validate all parameters and input

#### HTTP Security Headers

`Content-Security-Policy` - see Module 1

`Strict-Transport-Security` - enforce HTTPS communication

`X-Frame-Options: deny/sameorigin` - prevent response page rendering in `<iframe>`
- prevent **Clickjacking**
    - invisible `<iframes>` that you click on thinking you're clicking on item above
    - CSP can achieve similar with `frame-ancestors 'none';` or `'self' https://www.app.com`
    - `frame-ancestors` supercedes `X-Frame-Options` (supposedly)

#### HTTPS

Encrypted communitation e.g LetsEncrypt

Many modern Web API's not available without HTTPS
- Service Workers, Push Notifications, Geolocation, Webcam, Microphone etc

## Sessions Vs Tokens 

Two mechanisms to maintain the context between subsequent queries

#### Sessions based on cookies

Server maintains a store of session_id with associated objects. Can be protect against XSS with `Set-Cookie: HttpOnly`

**Cons:**
- Must be secured against CSRF
- Horizontal scaling requires more work as need session storage (1 server is fine)
    - load balancing issues
- sent with every request to all upper domains

#### Tokens (self contained)

- `Authorization: Bearer <token>`
- JWT (JSON Web Token)
    - It's not a protocol, just the format of the token

```
{
    HEADER: {alg: "HS356", typ: "JWT"}
    PAYLOAD: { username: "user", role: "admin", exp: 1556173133 }
    SIGNATURE: HMACSHA256( header + payload, SECRET)
}
```

JWT Token -> base64 string -> server validates authenticity & integrity

Oly the server knows the secret, and can validate the signed JWT Token integrity

Token is generated during `login`

- **Stateless** validation of the token, as there's no session storage on the server
- Horizontal scaling is easier
- communicate with multiple origins/domains - token can be sent in HTTP Header

**Cons**
- "cached" authorization
- secret needs to be shared between nodes (unless asymmetric algorithm used)
- storing in web app can be problematic (F5 refresh)

## When to use Sessions vs JWT Tokens

| Sessions | Tokens                                
| ---------| ------                      
| single server web app         | distributed enterprise environment    
| no enterprise scaling needed  | multiple domains/origins              
| you have backend access       | no session mechanism possible         
| usually enough                | securing 3rd party API
|                               | short lived grants (download/API access)
|                               | protocols like OAuth2/OpenID

> [JSON Web Tokens vs Session Cookies | Ponyfoo.com](https://ponyfoo.com/articles/json-web-tokens-vs-session-cookies)