import React, { useState } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'

function Comments() {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  const handleCommentChange = e => setComment(e.target.value)
  const handleEnterComment = () => {
    setComments(old => [
      {
        firstName: 'Anne',
        lastName: 'Cupcake',
        text: comment,
        date: new Date()
      },
      ...old
    ])
    setComment('')
  }

  return (
    <>
      <CommentBox
        text={comment}
        onChange={handleCommentChange}
        onEnter={handleEnterComment}
        user={{
          firstName: 'Anne',
          lastName: 'Cupcake'
        }}
      />
      <h3 className="text-black font-base mb-4 mt-8 text-base">
        Sorted by <span className="font-bold">Newest</span>
      </h3>
      <div className="bg-white p-4 rounded">
        {comments?.length > 0
          ? comments.map(comment => (
              <div key={comment.date} className="mb-6">
                <Comment comment={comment} />
              </div>
            ))
          : null}
      </div>
    </>
  )
}

const CommentBox = ({ text, onChange, onEnter, user }) => (
  <div className="flex w-full items-center">
    <div>
      <img
        src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&rounded=true&size=48`}
        alt="comment-avatar"
      />
    </div>
    <div className="w-full ml-2 h-16">
      <FormInput
        value={text}
        onChange={onChange}
        placeholder="Communicate with the resident here"
        inputClassName="h-16"
        inputProps={{
          onKeyPress: e => {
            if (e.charCode === 13) {
              onEnter()
            }
          }
        }}
      />
    </div>
  </div>
)

const Comment = ({ comment }) => {
  return (
    <div className="flex w-full">
      <div className="mr-4 flex items-center">
        <img
          src={`https://ui-avatars.com/api/?name=${comment?.firstName}+${comment?.lastName}&rounded=true&size=32`}
          alt="comment-avatar"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-bold text-base mb-1">{`${comment.firstName} ${comment.lastName}`}</p>
        <p className="text-base">{comment.text}</p>
        <p className="text-gray-600">{comment.date.toString()}</p>
      </div>
    </div>
  )
}

CommentBox.propTypes = {
  text: P.string,
  onChange: P.func,
  onEnter: P.func,
  user: P.object
}

Comment.propTypes = {
  comment: P.object
}

export default Comments