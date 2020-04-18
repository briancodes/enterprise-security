## API Security Implementation

#### User Auth Object

Authentication objects associated with sessions e.g. `express-session` with `session.user`
- be careful to return only public data
- Example was using static `User.toSafeUser(user)`

#### Server Side Session

In the demo we used an in memory server side session store - which is default with `express-session`

In production you would configure the `store` of express-session e.g. using Mongo DB/Redis strore

- https://www.npmjs.com/package/express-session#compatible-session-stores

#### Loggin API Events

Example of using `morgan`, and applying a config with a loggin stream writing to file using the npm library `rotating-file-stream`

#### Throttling Failed Logins

This would help prevent brute force attacks

## Input Sanitization and Validation

#### Validation

Validation e.g. `123` -> `API Error: minimum 5 characters`

Character sanitization/escaping e.g. `name: david <script>` -> `david &lt;script&gt;`


- Express Validator: https://express-validator.github.io/docs/
- Under the hood is using [validator.js](https://github.com/validatorjs/validator.js), `Used By: 350k+` with `15k stars` ⭐⭐⭐⭐

```javascript
function passwordValidator() {
  return check('password').isLength({ min: 5 })
    .withMessage('must have at least 5 characters');
}

function emailValidator() {
  return check('email').isEmail()
    .withMessage('is not valid');
}

// These get exported in array (or added to array)
// and used as middleware

app.post('/user', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});
```

#### Sanitization

```
function counterparty() {
  return check('counterparty').escape();
}
```

> Keep in mind that the request is mutated

#### Setting up CORS

Use express `cors`

> Note: if enabling `CORS` you probably won't be using `cookies` and `csrf` protection. Cookies + csrf protection is generally for same-origin client/server setup (you generally won't have a session cookie from a cross-origin XHR request)

#### Appendix

A note on using `return next()` - as in always use it!

```javascript
app.use((req, res, next) => {
  console.log('This is a middleware')
  next()
  console.log('This is first-half middleware')
})

app.use((req, res, next) => {
  console.log('This is second middleware')
  next()
})

app.use((req, res, next) => {
  console.log('This is third middleware')
  next()
})

// You will find out that the output in console is:

/*
This is a middleware
This is second middleware
This is third middleware
This is first-half middleware
*/
```