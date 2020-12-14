import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import { buildSchema, graphql as graphqlRequest } from 'graphql'
import { graphql } from 'msw'

const client = graphql.link('http://localhost:3000/graphql')

const schema = buildSchema(
  `
  type User {
    id: ID
    firstName: String
    lastName: String
    fullName: String
  }

  type LoginResponse {
    user: User
    token: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse
  }
`
)

const user = {
  id: '60333292-7ca1-4361-bf38-b6b43b90cb16',
  email: 'admin@orangeandcrane.com',
  firstName: 'Ciergio',
  lastName: 'Admin',
  fullName: 'Ciergio Admin'
}

const resolver = {
  me: (_args, context, _info) => {
    try {
      const hasToken = !!context.req.headers.get('slave')

      if (hasToken) {
        return user
      }

      throw new AuthenticationError('Unathorized, Please login.')
    } catch (error) {
      return error
    }
  },

  login: (args, _context, _info) => {
    try {
      if (
        args.email === 'admin@orangeandcrane.com' &&
        args.password === '123456'
      ) {
        return {
          user,
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
      }
      throw new UserInputError('Invalid email and password combination')
    } catch (error) {
      return error
    }
  }
}

export const handlers = [
  client.operation(async (req, res, ctx) => {
    const payload = await graphqlRequest(
      schema,
      req.body.query,
      resolver,
      { req },
      req.variables
    )

    return res(
      ctx.delay(1000),
      ctx.data(payload.data),
      ctx.errors(payload.errors)
    )
  })
]
