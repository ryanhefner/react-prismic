import React, { Component } from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

import { apiMethods } from './PrismicClient';
import withPrismic from './withPrismic';

class PrismicQuery extends Component {
  constructor(props) {
    super(props);

    const data = this.checkCache(props);

    this.state = {
      fetched: data ? true : false,
      loading: false,
      error: null,
      data,
    };

    if (data) {
      props.onLoad(this.state);
    }
  }

  componentDidMount() {
    if (!this.state.data) {
      this.requestData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.setState({
        fetched: false,
      }, () => {
        this.requestData();
      });
    }
  }

  checkCache(props) {
    const {
      parser,
      prismic,
    } = props;

    if (!prismic) {
      return null;
    }

    if (!prismic.client) {
      return null;
    }

    const cache = prismic.client.checkCache(props);

    if (cache) {
      return parser(cache, props);
    }

    return null;
  }

  getPropsMethod() {
    return Object.keys(this.props).find(key => {
      return apiMethods.indexOf(key) !== -1;
    });
  }

  async validateRequestRequirements() {
    return new Promise((resolve, reject) => {
      const {
        prismic,
      } = this.props;

      // Check for contentful context
      warning(prismic, 'No prismic context passed to <PrismicQuery />');

      if (!prismic) {
        return reject('No prismic context passed to <PrismicQuery />');
      }

      // Check if a method prop has been set
      const method = this.getPropsMethod();

      warning(method, 'No API method prop set on <PrismicQuery />');

      if (!method) {
        return reject('No API method prop set on <PrismicQuery />');
      }

      return resolve(true);
    });
  }

  async fetchData() {
    const {
      prismic,
      skip,
    } = this.props;

    if (skip) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      try {
        const {
          client,
          renderPromises,
        } = prismic;

        const method = this.getPropsMethod();

        const request = client[method].call(null, this.props[method]);

        if (renderPromises) {
          renderPromises.registerSSRObservable(this, request);
        }

        return resolve(request);
      }
      catch (error) {
        return reject(error);
      }
    });
  }

  requestData() {
    const {
      parser,
      onRequest,
      onLoad,
      onError,
    } = this.props;

    this.validateRequestRequirements().then(() => {
      this.setState({
        error: null,
        loading:  true,
      }, () => {
        onRequest(this.state);

        this.fetchData().then(response => {
          this.setState({
            data: parser(response, this.props),
            fetched: true,
            loading: false,
          }, () => {
            onLoad(this.state);
          });
        });
      });
    })
    .catch(error => {
      this.setState({
        error,
        fetched: true,
        loading: false,
      }, () => {
        onError(this.state);
      });
    });
  }

  getResult() {
    return this.state;
  }

  render() {
    const {
      children,
      prismic,
    } = this.props;

    const finish = () => children(this.getResult());

    if (prismic && prismic.renderPromises) {
      return prismic.renderPromises.addQueryPromise(this, finish);
    }

    return finish();
  }
}

PrismicQuery.propTypes = {
  // Method props
  currentExperiment: PropTypes.bool,
  everything: PropTypes.bool,
  form: PropTypes.shape({
    id: PropTypes.string,
  }),
  getBookmark: PropTypes.shape({
    bookmark: PropTypes.string,
    options: PropTypes.object,
    callback: PropTypes.func,
  }),
  getByID: PropTypes.shape({
    id: PropTypes.string,
    option: PropTypes.object,
    callback: PropTypes.func,
  }),
  getByIDs: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.object,
    callback: PropTypes.func,
  }),
  getByUID: PropTypes.shape({
    type: PropTypes.string,
    uid: PropTypes.string,
    options: PropTypes.object,
    callback: PropTypes.func,
  }),
  getSingle: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.object,
    callback: PropTypes.func,
  }),
  master: PropTypes.bool,
  previewSession: PropTypes.shape({
    token: PropTypes.string,
    linkResolver: PropTypes.func,
    defaultUrl: PropTypes.string,
    callback: PropTypes.func,
  }),
  query: PropTypes.shape({
    query: PropTypes.string,
    options: PropTypes.object,
    callback: PropTypes.func,
  }),
  queryFirst: PropTypes.shape({
    query: PropTypes.string,
    options: PropTypes.object,
    callback: PropTypes.func,
  }),
  prismicRef: PropTypes.shape({
    label: PropTypes.string,
  }),
  // Other props
  children: PropTypes.func,
  parser: PropTypes.func,
  skip: PropTypes.bool,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  onRequest: PropTypes.func,
};

PrismicQuery.defaultProps = {
  children: ({ data, error, fetched, loading }) => null,
  skip: false,
  parser: (data, props) => data,
  onError: (state) => {},
  onLoad: (state) => {},
  onRequest: (state) => {},
};

export default withPrismic(PrismicQuery);
