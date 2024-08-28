function makeExpressCallback(controller) {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        'User-Agent': req.get('User-Agent'),
      },
    };
    controller(httpRequest)
      .then((httpResponse) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        res.type('json');
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch(error => res.status(500).send({ error: `${error}` }));
  };
}

module.exports = { makeExpressCallback };
