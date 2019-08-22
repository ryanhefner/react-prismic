import Cache from 'creature-cache';
const Prismic = require('prismic-javascript');

export const apiMethods = [
  'currentExperiment',
  'everything',
  'form',
  'getBookmark',
  'getByID',
  'getByIDs',
  'getByUID',
  'getSingle',
  'master',
  'previewSession',
  'query',
  'queryFirst',
  'prismicRef',
];

export default (options) => {
  const {
    api: optionsApi,
    cache: optionsCache,
    repo,
  } = options;

  let api;

  /**
   * Initialize Prismic api
   *
   * @param string - repo
   * @retturn Promise<ResolvedApi>
   */
  function initializePrismicApi(repo) {
    api = Prismic.api(`https://${repo}.cdn.prismic.io/api/v2`);

    return api;
  }

  /**
   * Async method for structuring api access into requests.
   *
   * @param string - repo
   * @return Promise
   */
  async function getApi(repo) {
    if (!api) {
      return initializePrismicApi(repo);
    }

    return Promise.resolve(api)
  }

  // Either apply the passed in api, or initialize a new instance.
  if (optionsApi) {
    api = optionsApi;
  }
  else {
    initializePrismicApi(repo);
  }

  // Set cached to passed in value or initialize a new instance.
  const cache = optionsCache || new Cache();

  /**
   * Generate a standardized cached key to use for mapping request instances.
   *
   * @param string - method
   * @param array - args
   * @return string
   */
  function getCacheKey(method, args) {
    return JSON.stringify({
      method,
      args,
    });
  }

  /**
   * Check cache for instance based on arguments
   *
   * @param string - method
   * @param array - args
   * @return object
   */
  function getCachedRequest(method, args) {
    return cache.read(getCacheKey(method, args));
  }

  /**
   * Write value to cache and map to associated cache key based on args.
   *
   * @param string - method
   * @param array - args
   * @param object
   */
  function cacheRequest(method, args, value) {
    return cache.write(getCacheKey(method, args), value);
  }

  /**
   * Check for a cached response, and if empty make the request against the api.
   *
   * @param string - method
   * @param array - args
   */
  function makeCachedRequest(method, args) {
    const cachedRequest = getCachedRequest(method, args);

    if (cachedRequest) {
      return cachedRequest;
    }

    return new Promise((resolve, reject) => {
      getApi(repo)
        .then(api => {
          const apiMethod = method === 'prismicRef' ? 'ref' : method;

          api[apiMethod](...args)
            .then(response => {
              cacheRequest(method, args, response);

              return response;
            })
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  }

  /**
   * Check the cache to see if entry exists for provided props.
   *
   * @param Object - props
   * @return null | Object
   */
  function checkCache(props) {
    const method = Object.keys(props).find(key => {
      return apiMethods.indexOf(key) !== -1;
    });

    const cacheKey = getCacheKey(method, props[method]);

    return cache.has(cacheKey) && cache.read(cacheKey);
  }

  return {
    currentExperiment: () => makeCachedRequest('currentExperiment'),
    everything: () => makeCachedRequest('everything'),
    form: ({ id }) => makeCachedRequest('form', [ id ]),
    getBookmark: ({ bookmark, options, callback }) => makeCachedRequest('getBookmark', [ bookmark, options, callback ]),
    getByID: ({ id, options, callback }) => makeCachedRequest('getByID', [ id, options, callback ]),
    getByIDs: ({ ids, options, callback }) => makeCachedRequest('getByIDs', [ ids, options, callback ]),
    getByUID: ({ type, uid, options, callback }) => makeCachedRequest('getByUID', [ type, uid, options, callback ]),
    getSingle: ({ type, options, callback }) => makeCachedRequest('getSingle', [ type, options, callback ]),
    master: () => makeCachedRequest('master'),
    previewSession: ({ token, linkResolver, defaultUrl, callback }) => makeCachedRequest('previewSession', [ token, linkResolver, defaultUrl, callback ]),
    query: ({ query, options, callback }) => makeCachedRequest('query', [ query, options, callback ]),
    queryFirst: ({ query, options, callback }) => makeCachedRequest('queryFirst', [ query, options, callback ]),
    prismicRef: ({ label }) => makeCachedRequest('prismicRef', [ label ]),
    cache,
    checkCache,
  };
}
