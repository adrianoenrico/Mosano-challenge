module.exports = {
  siteMetadata: {
    title: 'Hello There!',
    siteUrl: 'https://mosano.web.app'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
  ],
}
