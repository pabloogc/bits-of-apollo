# Bits Of Apollo

To build and run with nx:

```sh
npm install 
npx nx serve
```

Server should be up on: http://localhost:4000/graphql

## Focus of this project

To do this test in a reasonable amount of time I decided to cut corners in common business logic that has been solved
countless times and instead focus on what I consider critical decisions

#### Structure the schema, resolvers, repositories, etc., for long term development

When writing GraphQL applications one of the most difficult tasks I usually encountered
is organizing the project in a way that makes sense for the long run, in this case I opted for

* folder<=>feature structure keeping related models, services, resolvers together when it makes sense.

I always enjoyed the ideas of [hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
despite the complexity it comes with some general concepts like code organization I find very practical.

* schema-first
  I opted for a schema first approach, when the API evolves the GraphQL type the Entity type (Show, Auction...) will
  most likely drift apart and require their own models, in that scenario I want to minimize the amount of "noise" a
  change generates, an internal change to the model representing the auction in the backend should have no effect on the
  schema.

With that said, a code first approach would like work 95% identically to schema first given it is properly organized.

#### Make code easily unit testable with Dependency Injection

As mentioned before, writing unit tests, or integration tests for apollo for that matter, is a solved problem
so I chose not write these test for the showcase and instead spend that structuring the code in a way so that
testing it becomes trivial, should I have the time for this technical test, in this case by:

* Using dependency injection, which makes testing complex business classes like resolvers trivial passing a proper mock
  when instantiating them in the tests
* Using composition of simple classes whenever possible
* Avoiding global constant objects, which again just make testing more cumbersome

#### Schema design

Defining a GraphQL schema, as with any kind of API, is hard when you start thinking about long term maintainability,
in this case the most impactful decisions were:

* All mutations / queries that require more than one parameter use a input type object instead of multi-parameter. The
  complexity added by the extra type is a tradeoff for easy backwards compatibility with the clients.
* All mutation / queries return the type object they modify to allow clients avoid costly real time subscriptions or
  re-fetches (particularity important for mobile where battery and data usage are concerns)

## What I would add to this project if I had to put 10+ more hours

* Any kind of business logic that you would expect for an actual application. For example:
  * Only the owner of a show can modify the show, start auctions, so on
  * The owner of a product shouldn't be able to bid to its own product
  * Unauthenticated users shouldn't be able to bid
  * Can't create auctions for non-started shows
  * Can't add products to started shows
  * Give sensible error messages when an operation fails (updating a show that doesn't exist, bidding on a completed
    auction, so on)
* Ensuring data races when bidding are impossible (ie, make bidding an atomic operation backend side)
* Having an actual persistent pub-sub system instead of an in-memory solution
* Having an actual database so repositories can become more real-world like
* Adding [data-loaders](https://github.com/graphql/dataloader) basically for all entities, but specially for the ones
  that will be queried as nested objects like products, auctions and users to avoid multiple calls to the repository /
  DB
* Having a better scheduler for auction completion instead of `node-schedule`. It was the simplest one for this scenario
  but a persistent one should be required in a real world to make it fault-tolerant.
* Having an error handler in place to both observe, report and handle using common tools like datadog, rollbar &
  similar. In this
  case [Apollo already provides all tha facilities for doing so](https://www.apollographql.com/docs/apollo-server/data/errors/)
  through plugins so I decided to keep it out of the demo as is it a solved problem.

## Using the application

Since this is a pure backend project I didn't invest time into creating a demo UI, however, the apollo server interface
is enough to try out all the queries / mutations / subscriptions with the following queries.

When the server starts a demo show with a potato 🥔is being auctioned.

The variables being used, modify values for testing

```json
{
  "productName": "Potato",
  "showID": "0",
  "startingBid": 0,
  "productID": "0",
  "auctionID": "0",
  "bid": 123
}
```

```graphql

subscription Subscription($auctionID: ID!) {
  # Real time subscription to auction changes, when an bid happens or an auction completes this will be invoked
  # There is no subscription to an auction created event, but would be very similar to this one expect
  # tied to the show ID
  auctionUpdated(auctionID: $auctionID) {
    state
    currentBid
  }
}

query GetAllShows {
  # Generic query to get all shows information
  shows {
    id
    state
    ownerID
    products {
      id
      name
    }
    auctions {
      highestBidderID
      currentBid
      finishesAt
      state
    }
    owner{
      id
    }
  }
}


mutation CreateShow {
  # Create a new show
  createShow {
    id
  }
}

mutation AddProductToShow($showID: ID!, $productName: String!) {
  addProductToShow(input: {showID: $showID, name: $productName}) {
    products {
      id
      name
    }
  }
}

mutation Mutation($showID: ID!) {
  startShow(showID: $showID) {
    state
  }
}

mutation StartAuction($showID: ID!, $productID: ID!, $startingBid: Int!) {
  # Start a new auction, after this you can bid to it, probably you want a product before hand
  startAuction(input: {
    showID: $showID,
    productID: $productID,
    startingBid: $startingBid
  }) {
    products {
      id
    }
  }
}

mutation BidToAuction($auctionID: ID!, $bid: Int!) {
  bidToAuction(input: {
    auctionID: $auctionID,
    bid: $bid
  }) {
    currentBid
    finishesAt
    highestBidderID
    state
    id
    productID
  }
}


```
