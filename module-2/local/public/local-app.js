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
