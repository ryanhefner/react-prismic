import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PrismicClient from './PrismicClient';
import PrismicContext from './PrismicContext';

class PrismicProvider extends Component {
  constructor(props) {
    super(props);

    const {
      api,
      cache,
      client,
      renderPromises,
      repo,
    } = props;

    this.state = {
      client: client || new PrismicClient({ api, cache, repo }),
      renderPromises,
    };
  }

  render() {
    const Context = this.props.context || PrismicContext;

    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

PrismicProvider.propTypes = {
  api: PropTypes.object,
  children: PropTypes.any,
  cache: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  client: PropTypes.object,
  context: PropTypes.object,
  repo: PropTypes.string,
  renderPromises: PropTypes.object,
};

export default PrismicProvider;
