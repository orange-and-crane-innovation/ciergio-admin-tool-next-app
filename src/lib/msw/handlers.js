import { graphql } from 'msw'

const client = graphql.link('http://localhost:3000/graphql')

export const handlers = [
  client.mutation('Login', (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.data({
        data: null
      }),
      ctx.errors([
        {
          message: 'Access denied',
          positions: [1, 92]
        }
      ])
    )
  }),

  client.operation((req, res, ctx) => {
    console.log('ctx', ctx)

    return res(
      ctx.status(403),
      ctx.data({
        data: null
      }),
      ctx.errors([
        {
          message: 'Access denied',
          positions: [1, 92]
        }
      ])
    )
  })
]
