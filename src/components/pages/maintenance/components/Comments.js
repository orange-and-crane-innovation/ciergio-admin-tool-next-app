import { useState, useEffect } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import dayjs from '@app/utils/date'

function Comments({ data, onEnterComment }) {
  const [comments, setComments] = useState(data?.data)
  const [comment, setComment] = useState('')
  const handleCommentChange = e => setComment(e.target.value)

  useEffect(() => {
    setComments(data?.data)
  }, [data])

  return (
    <>
      <CommentBox
        text={comment}
        onChange={handleCommentChange}
        onEnter={() => {
          onEnterComment(comment)
          setComment('')
        }}
        user={{
          firstName: 'Anne',
          lastName: 'Cupcake'
        }}
      />
      <h3 className="text-black font-base mb-4 mt-8 text-base">
        Sorted by <span className="font-bold">Newest</span>
      </h3>
      <div className="bg-white p-4 rounded">
        {data?.count > 0
          ? comments?.map(comment => (
              <div key={comment._id} className="mb-6">
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
  const user = comment?.user
  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&rounded=true&size=32`

  return (
    <div className="flex w-full">
      <div className="mr-4 flex items-start">
        <img src={avatar} alt="comment-avatar" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-bold text-base mb-1">{`${user.firstName} ${user.lastName}`}</p>
        <p className="text-base">{comment.comment}</p>
        <p className="text-gray-600">
          {dayjs(comment.createdAt).format('MMM DD, YYYY hh:mm A')}
        </p>
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

Comments.propTypes = {
  data: P.object.isRequired,
  onEnterComment: P.func.isRequired
}

export default Comments
