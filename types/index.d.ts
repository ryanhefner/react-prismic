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
  cache?: Cache;
  origin?: string;
  options?: object;
  renderPromises?: boolean;
}

export class PrismicContext {}

/**
 * PrismicProvider
 */

export interface ProviderProps {
  cache?: Cache;
  children?: ReactNode;
  context?: PrismicContext;
  renderPromises?: RenderPromises;
}

export class PrismicProvider extends Component<ProviderProps, ProviderProps> {}

/**
 * getDataFromTree
 */

export interface defaultInfo {
  seen: boolean;
  observerable: null;
}

export function makeDefaultInfo(): defaultInfo;

export function getDataFromTree(tree: any, context: any): any;

export function getMarkupFromTree(tree: any, context: any, renderFunction: () => void): Promise<any>;

/**
 * hoc-utils
 */

export function getDisplayName(WrappedComponent: Component): string;

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
  url: string;
  options?: any;
  parser?: ParserHandler;
  skip?: boolean;
  ignoreContextOptions?: boolean;
  onError?: (state: PrismicQueryState) => void;
  onLoad?: (state: PrismicQueryState) => void;
  onRequest?: (state: PrismicQueryState) => void;
}

export class RequestBlock extends Component<PrismicQueryProps, PrismicQueryState> {}

/**
 * RenderPromises
 */

export interface RequestBlockInfo {
  seen: boolean;
  observable: Promise<any> | null;
}

export interface RequestBlockMap {
  [key: string]: any;
}

export class RenderPromises {
  renderPromises: RequestBlockMap;
  infoTrie: RequestBlockMap;
  registerSSRObservable(instance: Component, observable: Promise<any>): void;
  getSSRObservable(instance: Component): Promise<any>;
  addPromise(instance: Component, finish: () => void): any;
  hasPromises(): boolean;
  consumeAndAwait(): Promise<any>;
  lookupInfo(instance: Component): RequestBlockInfo;
}

/**
 * withPrismic
 */

export function withPrismic(component: Component): Component;
