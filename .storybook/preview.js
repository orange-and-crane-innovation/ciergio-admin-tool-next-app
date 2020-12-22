import '../src/styles/globals.css'

const { addDecorator } = require('@storybook/react')
const { withPropsTable } = require('storybook-addon-react-docgen')

addDecorator(withPropsTable)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered'
}
