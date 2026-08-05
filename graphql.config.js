/** @type {import('graphql-config').IGraphQLConfig} */
module.exports = {
  projects: {
    gateway: {
      schema: './apps/api-gateway/**/*.graphql',
      documents: [
        'apps/api-gateway/**/*.{graphql,ts}',
        'libs/**/*.{graphql,ts}',
      ],
      extensions: {
        endpoints: {
          default: {
            url: 'http://localhost:3000/graphql',
          },
        },
      },
    },


  },
};
