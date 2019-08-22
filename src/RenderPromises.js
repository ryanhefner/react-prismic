function makeDefaultInfo() {
  return {
    seen: false,
    observable: null,
  };
}

export default class RenderPromises {
  // Map from Query component instances to pending fetchData promises.
  renderPromises = new Map();

  // Two-layered map from (query document, stringified variables) to RequestBlockInfo
  // objects. These RequestBlockInfo objects are intended to survive through the whole
  // getMarkupFromTree process, whereas specific RequestBlock instances do not survive
  // beyond a single call to renderToStaticMarkup.
  infoTrie = new Map();

  // Registers the server side rendered observable.
  registerSSRObservable(instance, observable) {
    this.lookupInfo(instance).observable = observable;
  }

  // Get's the cached observable that matches the SSR RequestBlock instances query and variables.
  getSSRObservable(instance) {
    return this.lookupInfo(instance).observable;
  }

  addPromise(instance, finish) {
    const info = this.lookupInfo(instance);
    if (!info.seen) {
      this.renderPromises.set(
        instance,
        new Promise(resolve => {
          resolve(instance.fetchData());
        }),
      );
      // Render null to abandon this subtree for this rendering, so that we
      // can wait for the data to arrive.
      return null;
    }
    return finish();
  }

  hasPromises() {
    return this.renderPromises.size > 0;
  }

  consumeAndAwaitPromises() {
    const promises = [];

    this.renderPromises.forEach((promise, instance) => {
      // Make sure we never try to call fetchData for this query document and
      // these variables again. Since the queryInstance objects change with
      // every rendering, deduplicating them by query and variables is the
      // best we can do. If a different Query component happens to have the
      // same query document and variables, it will be immediately rendered
      // by calling finish() in addPromise, which could result in the
      // rendering of an unwanted loading state, but that's not nearly as bad
      // as getting stuck in an infinite rendering loop because we kept calling
      // queryInstance.fetchData for the same Query component indefinitely.
      this.lookupInfo(instance).seen = true;
      promises.push(promise);
    });
    this.renderPromises.clear();

    return Promise.all(promises);
  }

  lookupInfo(instance) {
    const { infoTrie } = this;
    const {
      url,
      options,
    } = instance.props;

    const instanceObject = {
      url,
      options,
    };

    const varMap = infoTrie.get(JSON.stringify(instanceObject)) || new Map();

    if (!infoTrie.has(JSON.stringify(instanceObject))) {
      infoTrie.set(JSON.stringify(instanceObject), varMap);
    }

    const variablesString = JSON.stringify({
      url,
      options,
    });
    const info = varMap.get(variablesString) || makeDefaultInfo();

    if (!varMap.has(variablesString)) {
      varMap.set(variablesString, info);
    }

    return info;
  }
}
