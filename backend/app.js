const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const mongoose = require("mongoose");
const isAuth = require('./middleware/is-auth')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')

app.use(bodyParser.json());

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next()
})


app.use(isAuth)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);
mongoose
  .connect("mongodb://localhost:27017/graphQl")
  .then(() => {
    app.listen(8000, () => {
      console.log("Backend Running");
    });
  })
  .catch((err) => console.log(err));
