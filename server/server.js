const express = require("express");
const path = require("path");
const db = require("./config/connection");
//const routes = require('./routes');
const apollo = require("apollo-server-express");
// console.log(apollo);

const { ApolloServer } = apollo;
console.log(ApolloServer);
//const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in our schema data
/*const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// integrate our Apollo server with the express application as middleware
server.applyMiddleware({ app });*/
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

//app.use(routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
