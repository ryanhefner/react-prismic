import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { getDisplayName } from 'react-hoc-helpers';

import PrismicContext from './PrismicContext';

/**
 * A public higher-order component to access the imperative API
 */
function withPrismic(Component) {
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <PrismicContext.Consumer>
        {context => {
          return (
            <Component
              {...remainingProps}
              prismic={context}
              ref={wrappedComponentRef}
            />
          );
        }}
      </PrismicContext.Consumer>
    );
  };

  C.context = PrismicContext;
  C.displayName = `withPrismic(${getDisplayName(Component)})`;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);
}

export default withPrismic;
