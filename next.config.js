module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/bybit/:path*',
        destination: 'https://api.bybit.com/:path*',
      },
      {
        source: '/api/bitget/:path*',
        destination: 'https://api.bitget.com/:path*',
      },
      {
        source: '/api/bitfinex/:path*',
        destination: 'https://api.bitfinex.com/:path*',
      },
      {
        source: '/api/dydx/:path*',
        destination: 'https://api.dydx.exchange/:path*',
      },
      {
        source: '/api/okx/:path*',
        destination: 'https://www.okx.com/:path*',
      },
      {
        source: '/api/mexc/:path*',
        destination: 'https://api.mexc.com/:path*',
      },
      {
        source: '/api/mexc-futures/:path*',
        destination: 'https://contract.mexc.com/:path*',
      },
      {
        source: '/api/poloniex/:path*',
        destination: 'https://poloniex.com/:path*',
      },
      {
        source: '/api/poloniex-futures/:path*',
        destination: 'https://futures-api.poloniex.com/:path*',
      },
      {
        source: '/api/kraken/:path*',
        destination: 'https://api.kraken.com/:path*',
      },
      {
        source: '/api/cryptocom/:path*',
        destination: 'https://api.crypto.com/:path*',
      },
    ]
  },
}