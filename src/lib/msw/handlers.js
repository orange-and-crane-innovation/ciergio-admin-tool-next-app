import { graphql } from 'msw'

export const handlers = [
  graphql.query('Authenticate', (req, res, ctx) => {
    console.log('req', req)

    if (req.headers.get('slave')?.length > 0) {
      return res(
        ctx.data({
          user: {
            __typename: 'User',
            id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
            firstName: 'John',
            lastName: 'Maverick'
          }
        })
      )
    }

    return res(
      ctx.errors([{ message: 'Unauthorized', success: false, code: 403 }])
    )
  })
]
