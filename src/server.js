const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// HackerNewsの1つ1つの投稿
let links = [
    {
        id: "link-0",
        description: "テストテストテストテストテストテスト",
        url: "https://www.google.com/",
    },
];

// リゾルバ関数
const resolvers = {
    Query: {
        info: () => "Hacker News クローン",
        feed: () => links,
    },

    Mutation: {
        post: (parent, args) => {
            let idCount = links.length;

            const link = {
                id: `line-${idCount++}`,
                description: args.description,
                url: args.url,
            };

            links.push(link);

            return link;
        },
    },
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
    resolvers,
    // csrfPrevention: true,
});

server.listen().then(({ url }) =>
    console.log(`${url}でサーバー起動中
`)
);
