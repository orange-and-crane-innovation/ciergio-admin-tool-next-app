import '../styles/globals.css';

import P from 'prop-types';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: P.oneOfType([P.func, P.object]).isRequired,
  pageProps: P.object.isRequired,
};

export default MyApp;
