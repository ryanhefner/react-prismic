// TypeScript Version: 3.5

import { Component, Context, ReactNode } from 'react';
import { Api } from 'prismic-javascript';
import Cache from 'creature-cache';

/**
 * PrismicClient
 */

export class PrismicClient extends Api {
  cache: Cache;
  checkCache: () => any;
}

/**
 * PrismicContext
 */

export interface ContextProps<T = any> {
  cache: T;
}

export interface AnyContextProps extends ContextProps {
  [extraProps: string]: any;
}

export interface PrismicContext<A extends ContextProps = AnyContextProps> {
  api?: object;
  cache?: Cache;
  client?: PrismicClient;
  renderPromises?: object;
  repo?: string;
}

export class PrismicContext {}

/**
 * PrismicProvider
 */

export interface ProviderProps {
  cache?: Cache | Array<any> | string;
  children?: ReactNode;
  context?: PrismicContext;
  renderPromises?: object;
}

export class PrismicProvider extends Component<ProviderProps, ProviderProps> {}

/**
 * PrismicQuery
 */

export type ParserHandler = (data: any, props: any) => any;

export interface PrismicQueryState {
  fetched: boolean;
  loading: boolean;
  data?: any;
  error?: any;
}

export interface PrismicQueryProps {
  currentExperiment: boolean;
  everything: boolean;
  form: {
    id: string;
  };
  getBookmark: {
    bookmark: string;
    options?: any;
    callback?: () => void;
  };
  getByID: {
    id: string;
    options?: any;
    callback?: () => void;
  };
  getSingle: {
    type: string;
    options?: any;
    callback?: () => void;
  };
  master: boolean;
  previewSession: {
    token: string;
    linkResolver?: () => void;
    defaultUrl?: string;
    callback?: () => void;
  };
  query: {
    query: string;
    options?: any;
    callback?: () => void;
  };
  queryFirst: {
    query: string;
    options?: any;
    callback?: () => void;
  };
  parser?: ParserHandler;
  skip?: boolean;
  onError?: (state: PrismicQueryState) => void;
  onLoad?: (state: PrismicQueryState) => void;
  onRequest?: (state: PrismicQueryState) => void;
}

export class PrismicQuery extends Component<PrismicQueryProps, PrismicQueryState> {}

/**
 * withPrismic
 */

export function withPrismic(component: Component): Component;
