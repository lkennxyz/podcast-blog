module.exports = {
  siteMetadata: {
    title: 'Four Men & a Dwarf',
    description: 'Six idiots playing D&D',
    siteUrl: 'https://fourmenandadwarf.com',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        setup: ({ query: { site }}) => ({
          title: site.siteMetadata.title,
          description: site.siteMetadata.description,
          custom_namespaces: {
            itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
          },
          custom_elements: [
            { 'itunes:author': site.siteMetadata.title },
            { 'itunes:summary': site.siteMetadata.description },
            { 'itunes:owner': [
              { 'itunes:name': site.siteMetadata.title },
              { 'itunes:email': 'liam@lkenn.xyz' },
            ]},
            { 'itunes:explicit': 'Yes' },
            { 'itunes:categoryText': 'Comedy' },
            { 'itunes:image': {
              _attr: {
                href: 'https://files.fourmenandadwarf.com/file/kots-images/Logo.svg' 
              },
            }},

          ],
        }),
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges
                .filter(edge => !edge.node.frontmatter.tags.includes('test'))
                .map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  enclosure: { url: `${edge.node.frontmatter.file}`, type: 'audio/mpeg' },
                  custom_elements: [
                    { "content:encoded": edge.node.frontmatter.description + '<br>' + edge.node.html },
                    { 'itunes:image': {
                      _attr: {
                        href: 'https://files.fourmenandadwarf.com/file/kots-images/Logo.svg' 
                      },
                    }},
                  ],
                })
              })
            },
            query: `
              query BlogRollQuery {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] }
                  filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
                ) {
                  edges {
                    node {
                      id
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        description
                        templateKey
                        date(formatString: "MMMM DD, YYYY")
                        audioPost
                        file
                        tags
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Four Men & a Dwarf",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/",
            // optional configuration to specify external rss feed, such as feedburner
            //link: "https://feeds.feedburner.com/gatsby/blog",
          },
        ],
      },
    },
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: 'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
      options: {
        develop: true, // Activates purging in npm run develop
        purgeOnly: ['/all.sass'], // applies purging only on the bulma css file
      },
    }, // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
