# 📰 react-prismic

Easily compose [Prismic](https://prismic.io) requests and data into your React
applications.


## Install

Via [npm](https://npmjs.com/package/react-prismic)

```sh
npm install --save react-prismic
```

Via [Yarn](https://yarn.fyi/react-prismic)

```sh
yarn add react-prismic
```


## How to use

The goal of `react-prismic` is to take the thinking out of initializing a client
and making requests, and focused on making it easy to quickly setup and access
the data that you need from [Prismic](https://prismic.io) in your React apps.


### `PrismicProvider`

The `PrismicProvider` allows you to define a scope/client to used for your next
`PrismicQuery`s. In most setups, you’ll probably only need one instance of this,
composed around your main app. But, if you happen to have another section or component
or your app that needs to interface with a different Prismic repo, you can compose
these wherever you like and all nested `PrismicQuery`s will use the client for
each.

#### Props

* `repo: string` - The name of the Prismic repo you plan on querying.

> This is name that is before `.prismic.io` when you are looking at your repo in Prismic.

> `repo` should be good for 94.6% of instances when using this class. If you want
> to get fancy, the following `props` are also available for you.

* `api: PrismicApi` - If you’re already initialzing an instance of the Prismic API outside of the `PrismicProvider`, you can pass that in to keep using that same one.

> If you have a reason to override the Prismic API witth your own logic, like
> hitting your own custom endpoint, it should be assumed that your instance of
> the Prismic API matches the interface of the original.

* `cache: Cache | iterable` -

* `client: PrismicClient` -

* `renderPromises: RenderPromises` - Passed in via [`next-prismic`](https://github.com/ryanhefner/next-prismic) for requesting and rendering requests during server-side rendering.


#### Example

```js
import React from 'react';
import { PrismicProvider } from 'react-prismic';

import Component from './Component';

const App = () => (
  <PrismicProvider repo="[your-prismic-repo]">
    <Component />
  </PrismicProvider>
);
```


### `PrismicQuery`

This is where the magic happens ✨ Easily compose Prismic queries into your React applications.
Instead of getting crafty with some unmappable props -> method fiasco, I’ve just
exposed all the available methods from the [`Prismic - ResolvedApi`](https://prismicio.github.io/prismic-javascript/classes/resolvedapi.html)
as props to make it easy to choose the method that best suits your needs without
another API to learn.

The only caveat to this is, instead of just passing in an array of arguments to
the methods, I’ve mapped an object to the function args. It feels more React-y
when using it, but I’m also open to a discussion on a better way to handle these
since the prop list is rather verbose right now.

> For more details about the Prismic API, I highly recommend that you reference
> their [`prismic-javascript` documentation](https://prismicio.github.io/prismic-javascript/index.html).

#### Props

* `currentExperience: boolean`

* `everything: boolean`

* `getBookmark: { bookamark, options?, callback }`

* `getByID: { id, options?, callback? }`

* `getByIDs: { ids, options?, callback? }`

* `getByUID: { type, uid, options?, callback? }`

* `getSingle: { type, options?, callback? }`

* `master: boolean`

* `previewSession: { token, linkResolver, defaultUrl, callback? }`

* `query: { query, options?, callback? }`

* `queryFirst: { query, options?, callback? }`

* `prismicRef: { label }` - This is the one method that doesn’t map directly to the existing API, since it conflicts with React’s native `ref` prop.

* `skip: boolean` - Skip the request during server-side rendering.

* `onError: ({ data, error, loading, fetch }) => {}` - Called when an error is encountered during the request.

* `onLoad: ({ data, error, loading, fetched }) => {}` - Called when the request has finished loading.

* `onRequest: ({ data, error, loading, fetched }) => {}` - Called when the request has been initiated.


#### Example

```js
import React from 'react';
import { PrismicQuery } from 'react-prismic';
import { RichText } from 'prismic-reactjs';

const Component = () => (
  <React.Fragment>
    <header>
      <PrismicQuery getSingle={{ type: 'header' }}>
        {({ data, error, fetched }) => {
          if (!fetched) {
            return null;
          }

          if (error) {
            console.error(error);
            return null;
          }

          const {
            name,
            logo,
            logoLink,
            headerLinks,
          } = data.data;

          return (
            <React.Fragment>
              <div className="header__logo">
                <a href={logoLink.url}>
                  {logo && <img src={logo.url} alt={name} />}
                  <h1>{name}</h1>
                </a>
              </div>
              <div className="header__links">
                {headerLinks && headerLinks.value.map(headerLink => (
                  <a href={headerLink.link.value.url}>
                    {headerLink.link_title.value.text}
                  </a>
                ))}
              </div>
            </React.Fragment>
          );
        }}
      </PrismicQuery>
    </header>
    <main>
      <PrismicQuery>
        {({ data, error, fetched}) => {
          ...
        }}
      </PrismicQuery>
    </main>
    <footer>
      <PrismicQuery getSingle={{ type: 'footer' }}>
        {({ data, error, fetched }) => {
          ...
        }}
      </PrismicQuery>
    </footer>
  </React.Fragment>
);

export default Component;
```


### `withPrismic`

Have another type of component in mind to use within your `PrismicProvider`?
By using `withPrismic` you can expose the `prismic` context to your component
and utilize whatever is available. (Pssst...this is what the `PrismicQuery`
component is using.)


#### Context

* `client: PrismicClient` - Use this to make requests, access the cache, or whatever else you might want to do.

* `renderPromises: RenderPromises` - This is typically only set during server-side rendering (used by `next-prismic`), but available just letting you know in case you might need it.


#### Example

```js
import React from 'react';
import { withPrismic } from 'react-prismic';

const Component = ({ prismic }) => {
  const {
    client,
  } = prismic;

  [do something with client]
};

export default withPrismic(Component);

```


### `PrismicClient`

Again, this is one of those classes that you’ll rarely have to interface with
since the `PrismicProvider` takes care of instantiating an instance for you. But,
in an effort of making truly open, open source software, here is a little breakdown
of the `PrismicClient`

#### Options

* `api: PrismicClient` - Available for the wild ones, the dreamers. Pass in your own Prismic API interface in the event you need to do some low-level shenanigans.

* `cache: Cache` - Internally this package uses [`creature-cache`](https://github.com/ryanhefner/creature-cache), but there’s nothing preventing you from using something else, as long as you implement your’s with the same interface.

* `repo: string` - String of the Prismic repo you are planning to access.

> This is name that is before `.prismic.io` when you are looking at your repo in Prismic. (ex. `your-repo.prismic.io`, the `repo` would be `your-repo`)


#### Example

```js
import { PrismicClient } from 'react-prismic';

const prismicClient = new PrismicClient({
  repo: '[name of prismic repo, ex. `your-repo` of your-repo.prismic.io]'
});
```


## Using Next.js?

If you like what you see above, you might like [next-prismic](https://github.com/ryanhefner/next-prismic),
which lets you easily add `react-prismic` to your Next.js app, making it easy
to ensure that all your `PrismicQuery` instances render awesomely server-side.


## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
