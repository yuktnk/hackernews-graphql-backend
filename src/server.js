const { ApolloServer, gql } = require("apollo-server");

// HackerNewsの1つ1つの投稿
let links = [
    {
        id: "link-0",
        description: "テストテストテストテストテストテスト",
        url: "https://www.google.com/",
    },
];

// GraphQLスキーマの定義
const typeDefs = gql`
    type Query {
        info: String!
        feed: [Link]!
    }

    type Link {
        id: ID!
        description: String!
        url: String!
    }
`;

// リゾルバ関数
const resolvers = {
    Query: {
        info: () => "Hacker News クローン",
        feed: () => links,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // csrfPrevention: true,
});

server.listen().then(({ url }) =>
    console.log(`${url}でサーバー起動中
`)
);
