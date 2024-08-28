require('../config/config');
const request = require('superagent');

const url = process.env.CIFWK_API;
const { makeExternalApi } = require('./external-api');

const useExternalApi = makeExternalApi({ request, url });

const useExternalApiService = Object.freeze({
  useExternalApi,
});

module.exports = {
  useExternalApiService,
  useExternalApi,
};
