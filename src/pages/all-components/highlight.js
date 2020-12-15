import SyntaxHighlighter from 'react-syntax-highlighter'
import P from 'prop-types'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function Component({ code }) {
  return (
    <div className="text-xs">
      <SyntaxHighlighter
        language="jsx"
        lineProps={{
          style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
        }}
        showLineNumbers={true}
        // style={dark}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

Component.defaultProps = {
  code: ''
}

Component.propTypes = {
  code: P.string
}

export default Component
