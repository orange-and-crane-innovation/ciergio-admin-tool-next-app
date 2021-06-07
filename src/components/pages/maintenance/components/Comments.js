import { useState, useEffect } from 'react'
import P from 'prop-types'
import axios from 'axios'
import { FiImage, FiMessageCircle } from 'react-icons/fi'

import Button from '@app/components/button'
import FormTextArea from '@app/components/forms/form-textarea'
import UploaderImage from '@app/components/uploader/image'
import LightBox from '@app/components/lightbox'

import dayjs from '@app/utils/date'
import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

import NotifCard from '@app/components/globals/NotifCard'

function Comments({ data, loading, onEnterComment, onLoadMore }) {
  const [comments, setComments] = useState(data?.data)
  const [comment, setComment] = useState('')
  const [imageAttachments, setImageAttachments] = useState(null)

  useEffect(() => {
    setComments(data?.data)
  }, [data])

  const handleCommentChange = e => setComment(e)
  const handleImageChange = e => setImageAttachments(e)

  return (
    <>
      <CommentBox
        text={comment}
        images={imageAttachments}
        onChange={handleCommentChange}
        onEnter={() => {
          onEnterComment({
            comment,
            imageAttachments
          })
          setComment('')
          setImageAttachments(null)
        }}
        onImageChange={handleImageChange}
      />
      <h3 className="text-black font-base mb-4 mt-8 text-base">
        Sorted by <span className="font-bold">Newest</span>
      </h3>
      <div className="bg-white p-4 rounded border border-neutral-300">
        {data?.count > 0 ? (
          <>
            {comments?.map(comment => (
              <div key={comment._id} className="mb-6">
                <Comment comment={comment} />
              </div>
            ))}

            {data?.limit < data?.count && (
              <span className="flex justify-center">
                <Button
                  label="Load more comments"
                  loading={loading}
                  onClick={onLoadMore}
                  noBorder
                />
              </span>
            )}
          </>
        ) : data?.count === 0 ? (
          <NotifCard icon={<FiMessageCircle />} header="No Comments found" />
        ) : null}
      </div>
    </>
  )
}

const CommentBox = ({ text, images, onChange, onEnter, onImageChange }) => {
  const [loading, setLoading] = useState(false)
  const [maxImages] = useState(3)
  const [showImage, setShowImage] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [imageUploadError, setImageUploadError] = useState()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id

  useEffect(() => {
    onImageChange(imageUploadedData)
  }, [imageUploadedData])

  useEffect(() => {
    if (!images) {
      setImageUrls([])
      setImageUploadedData([])
      setImageUploadError(null)
      setShowImage(false)
    }
  }, [images])

  const handleImage = () => {
    setShowImage(prev => !prev)
  }

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyID
      }
    }

    await axios
      .post(process.env.NEXT_PUBLIC_UPLOAD_API, payload, config)
      .then(function (response) {
        if (response.data) {
          response.data.map(item => {
            setImageUrls(prevArr => [...prevArr, item.location])
            return setImageUploadedData(prevArr => [
              ...prevArr,
              {
                url: item.location,
                type: item.mimetype
              }
            ])
          })
          setImageUploadError(null)
        }
      })
      .catch(function (error) {
        const errMsg = 'Failed to upload image. Please try again.'
        console.log(error)
        showToast('danger', errMsg)
        setImageUploadError(errMsg)
      })
      .then(() => {
        setLoading(false)
      })
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length + imageUrls?.length > maxImages) {
        showToast('info', `Maximum of ${maxImages} files only`)
      } else {
        setLoading(true)
        setImageUploadError(null)

        for (const file of files) {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          formData.append('files', file)
          fileList.push(file)
        }

        uploadApi(formData)
      }
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    const uploadedImages = imageUploadedData.filter(image => {
      return image.url !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
    setImageUploadedData(uploadedImages)
  }

  return (
    <div className="flex w-full items-start mb-8">
      <div className="mt-2">
        <div className="w-14 h-14 rounded-full overflow-auto border border-neutral-300">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&rounded=true&size=48`}
            alt="comment-avatar"
            className="h-full w-full object-contain object-center"
          />
        </div>
      </div>
      <div className="relative py-2 ml-2 -mb-4 w-full h-full bg-white border rounded-md overflow-auto">
        <FormTextArea
          wrapperClassName="h-full pr-12"
          editorClassName="pb-4"
          maxLength={500}
          placeholder="Communicate with the resident here"
          value={text}
          onChange={onChange}
          toolbarHidden
          stripHtmls
          noBorder
        />

        <span
          className="absolute top-6 right-6 cursor-pointer hover:text-primary-900"
          role="button"
          tabIndex={0}
          onKeyDown={() => {}}
          onClick={handleImage}
        >
          <FiImage />
        </span>

        {(text || showImage) && (
          <div className="mt-4 flex items-end justify-between">
            <div className="px-4">
              {showImage && (
                <UploaderImage
                  name="image"
                  multiple
                  maxImages={maxImages}
                  images={imageUrls}
                  loading={loading}
                  error={imageUploadError ?? null}
                  onUploadImage={onUploadImage}
                  onRemoveImage={onRemoveImage}
                />
              )}
            </div>
            <Button
              className="mx-4"
              primary
              label="Post Comment"
              type="button"
              loading={loading}
              onClick={onEnter}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const Comment = ({ comment }) => {
  const [imageLists, setImageLists] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [imageOpen, setImageOpen] = useState(false)

  const user = comment?.user
  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&rounded=true&size=32`

  useEffect(() => {
    if (comment?.mediaAttachments) {
      setImageLists(comment?.mediaAttachments.map(image => image.url))
    }
  }, [comment])

  const handleImageOpen = index => {
    setImageOpen(true)
    handleImageIndex(index)
  }

  const handleImageClose = () => {
    setImageOpen(false)
  }

  const handleImageIndex = index => {
    setImageIndex(index)
  }

  return (
    <div className="flex w-full">
      <div className="mr-4 flex items-start">
        <div className="w-10 h-10 rounded-full overflow-auto border border-neutral-300">
          <img
            src={avatar}
            alt="comment-avatar"
            className="h-full w-full object-contain object-center"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center text-base leading-7">
        <p className="font-bold">{`${user?.firstName} ${user?.lastName}`}</p>
        <p>{comment?.comment}</p>
        {comment?.mediaAttachments?.length > 0 && (
          <div className="flex mb-4">
            {comment?.mediaAttachments?.map((media, index) => (
              <div
                className="mr-1 w-16 h-16 rounded-md overflow-auto border border-neutral-300"
                key={media._id}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={() => handleImageOpen(index)}
              >
                <img
                  src={media.url}
                  alt={`images-${index}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        )}
        <p className="text-neutral-600 text-md leading-5">
          {dayjs(comment.createdAt).format('MMM DD, YYYY hh:mm A')}
        </p>
      </div>

      <LightBox
        isOpen={imageOpen}
        images={imageLists}
        imageIndex={imageIndex}
        onClick={handleImageIndex}
        onClose={handleImageClose}
      />
    </div>
  )
}

CommentBox.propTypes = {
  text: P.string,
  images: P.array,
  onChange: P.func,
  onEnter: P.func,
  onImageChange: P.func
}

Comment.propTypes = {
  comment: P.object
}

Comments.propTypes = {
  data: P.object.isRequired,
  loading: P.bool.isRequired,
  onEnterComment: P.func.isRequired,
  onLoadMore: P.func.isRequired
}

export default Comments
