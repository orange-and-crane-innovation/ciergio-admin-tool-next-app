import P from 'prop-types'

function Component({ title, content, actions, className }) {
  return (
    <div className={`card ${className || ''}`}>
      {title && (
        <div className="header">
          <div className="title">{title}</div>
          <div className="actions">
            {actions && actions.length > 0
              ? actions.map((action, i) => {
                  return (
                    <div className="p-0" key={'key' + i}>
                      {' '}
                      {action}{' '}
                    </div>
                  )
                })
              : null}
          </div>
        </div>
      )}
      <div className="content">{content}</div>
    </div>
  )
}
Component.propTypes = {
  title: P.any,
  content: P.any,
  actions: P.array,
  className: P.string
}

export default Component
