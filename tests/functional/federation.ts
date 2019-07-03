import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { buildSchema, Field, ObjectType, Query, Resolver, Federation, ID } from "../../src";
import { printSchema } from "@apollo/federation";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";

const { Extends, Key, External, Provides } = Federation;

interface ReviewData {
  id: string;
  authorID: string;
  product: { upc: string };
  body: string;
}

interface UsernameData {
  id: string;
  username: string;
}

const usernames: UsernameData[] = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@complete" },
];

const reviews: ReviewData[] = [
  {
    id: "1",
    authorID: "1",
    product: { upc: "1" },
    body: "Love it!",
  },
  {
    id: "2",
    authorID: "1",
    product: { upc: "2" },
    body: "Too expensive.",
  },
  {
    id: "3",
    authorID: "2",
    product: { upc: "3" },
    body: "Could be better.",
  },
  {
    id: "4",
    authorID: "2",
    product: { upc: "1" },
    body: "Prefer something else.",
  },
];

describe("Apollo Federation", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    @ObjectType()
    @Extends()
    @Key({ fields: "id" })
    class User {
      @Field(() => ID)
      @External()
      id: string;

      constructor(id: string) {
        this.id = id;
      }

      @Field(() => String, { nullable: true })
      @External()
      username(): string | null {
        const found = usernames.find(username => username.id === this.id);

        return found ? found.username : null;
      }

      @Field(() => [Review])
      reviews(): Review[] {
        return reviews
          .filter(review => review.authorID === this.id)
          .map(review => new Review(review));
      }
    }

    @ObjectType()
    @Extends()
    @Key({ fields: "upc" })
    class Product {
      @Field()
      @Federation.External()
      upc: string;

      @Field(() => [Review])
      reviews: Review[];

      constructor(upc: string) {
        this.upc = upc;
      }
    }

    @ObjectType()
    @Key({ fields: "id" })
    class Review {
      @Field(() => ID)
      id: string;

      @Field()
      body: string;

      @Field(() => User)
      @Provides({ fields: "username" })
      author: User;

      @Field()
      product: Product;

      constructor({ id, body, authorID, product }: ReviewData) {
        this.id = id;
        this.body = body;
        this.author = new User(authorID);
        this.product = new Product(product.upc);
      }
    }

    @Resolver()
    class ReviewsResolver {
      @Query(() => [Review])
      reviews(): Review[] {
        return reviews.map(review => new Review(review));
      }
    }

    schema = await buildSchema({
      resolvers: [ReviewsResolver],
    });
  });

  beforeAll(() => getMetadataStorage().clear());

  afterEach(done => {
    jest.restoreAllMocks();
    done();
  });

  it("print federated schema", () => {
    const printed = printSchema(schema);

    expect(printed).toEqual(`type Product @key(fields: "upc") @extends {
  upc: String! @external
  reviews: [Review!]!
}

type Query {
  reviews: [Review!]!
}

type Review @key(fields: "id") {
  id: ID!
  body: String!
  author: User! @provides(fields: "username")
  product: Product!
}

type User @key(fields: "id") @extends {
  id: ID! @external
  username: String @external
  reviews: [Review!]!
}
`);
  });
});
