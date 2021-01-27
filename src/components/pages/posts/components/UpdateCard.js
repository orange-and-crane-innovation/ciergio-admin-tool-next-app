import React from 'react'
import PropTypes from 'prop-types'

const Component = ({ type, title }) => {
  let typeName = ''

  if (type === 'unpublished') {
    typeName = 'unpublish'
  } else if (type === 'trashed') {
    typeName = 'move to trash'
  } else if (type === 'deleted') {
    typeName = 'delete permanently'
  } else if (type === 'draft') {
    typeName = 'restore'
  }

  return (
    <div className="text-base font-normal">
      {type === 'draft' ? (
        <>
          <p>
            {`Are you sure you want to `}
            <strong>{`${typeName} "${title}"? `}</strong>
          </p>
          <br />
          <p>The post will be automatically save as DRAFT.</p>
        </>
      ) : type === 'preview' ? (
        <>
          <p>
            To capture all the changes made in your post, we need to save it to
            drafts first.
          </p>
        </>
      ) : (
        <>
          <p>
            {`You are about to `}
            <strong>{`${typeName} "${title}" `}</strong>
            {`from the list.`}
          </p>
          <br />
          <p>Do you want to continue?</p>
        </>
      )}

      <br />
    </div>
  )
}

Component.propTypes = {
  type: PropTypes.string,
  title: PropTypes.any
}

export default Component
