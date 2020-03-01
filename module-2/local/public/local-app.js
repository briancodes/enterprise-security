console.log(
  '%cLocal Script',
  'background: pink; color: black; font-size: 14px'
);

(function() {
  const logResult = (...prefix) => (...values) => {
    console.log(...prefix.concat(values));
  };

  const callApi = url => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(res ? `${res.status} ${res.statusText}` : 'Error');
        }
        return res.json();
      })
      .then(logResult(url, 'success'))
      .catch(logResult(url, 'catch'));
  };

  callApi('local-api');
  callApi('http://localhost:8000/remote-api');
})();

document.getElementById('iframe-holder').innerHTML = `
    <iframe
        src="https://www.w3.org"
    ></iframe>
    <!-- script elements don't execute using innerHTML by default (but beware of ssr!) -->
    <script>
        console.log('script elements don't execute when added via innerHTML');
    </script>
    <script src="http://localhost:8000/remote-app.js"></script>
`;

// Error: Refused to execute inline event handler violates CSP directive script-src
// nonce and sha-xxx don't work with inline handlers, so prevents them
// Possilby can be bypassed with custom sha, but in general to be avoided
// https://github.com/w3c/webappsec-csp/issues/13
document.getElementById('img-holder').innerHTML = `
    <img nonce="1" src="/" onerror="console.log('image xss')">
`;
