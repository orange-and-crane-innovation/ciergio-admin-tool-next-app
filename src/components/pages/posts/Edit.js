/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation, useQuery } from '@apollo/client'
import axios from 'axios'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'
import Modal from '@app/components/modal'

import VideoPlayer from '@app/components/globals/VideoPlayer'
import SelectCategory from '@app/components/globals/SelectCategory'

import showToast from '@app/utils/toast'

import UpdateCard from './components/UpdateCard'
import AudienceModal from './components/AudienceModal'
import PublishTimeModal from './components/PublishTimeModal'

import style from './Create.module.css'

const UPDATE_POST_MUTATION = gql`
  mutation($id: String, $data: PostInput) {
    updatePost(id: $id, data: $data) {
      _id
      processId
      message
    }
  }
`

const GET_POST_QUERY = gql`
  query getAllPost($where: AllPostInput) {
    getAllPost(where: $where) {
      count
      limit
      offset
      post {
        _id
        title
        content
        status
        createdAt
        updatedAt
        publishedAt
        author {
          user {
            firstName
            lastName
          }
        }
        category {
          _id
          name
        }
        primaryMedia {
          url
          type
        }
        embeddedMediaFiles {
          url
          type
        }
        audienceType
        audienceExpanse {
          company {
            id
          }
          complex {
            id
          }
          building {
            id
          }
        }
        audienceExceptions {
          company {
            id
          }
          complex {
            id
          }
          building {
            id
          }
        }
      }
    }
  }
`

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .label('Title')
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65)
    .required(),
  content: yup.string().label('Content').required(),
  images: yup.array().label('Image').nullable().required(),
  category: yup.string().label('Category').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65),
  content: yup.mixed(),
  category: yup.string().nullable()
})

const CreatePosts = () => {
  const { query, push } = useRouter()
  const [loading, setLoading] = useState(false)
  const [maxImages] = useState(3)
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [videoUrl, setVideoUrl] = useState()
  const [videoError, setVideoError] = useState()
  const [videoLoading, setVideoLoading] = useState(false)
  const [inputMaxLength] = useState(65)
  const [textCount, setTextCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()
  const [modalID, setModalID] = useState()
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [modalFooter, setModalFooter] = useState(null)
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const [showPublishTimeModal, setShowPublishTimeModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedAudienceType, setSelectedAudienceType] = useState('all')
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()
  const [selectedPublishTimeType, setSelectedPublishTimeType] = useState('now')
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState()
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [isEdit, setIsEdit] = useState(true)

  const [
    updatePost,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_POST_MUTATION)

  const { loading: loadingPost, data: dataPost, error: errorPost } = useQuery(
    GET_POST_QUERY,
    {
      variables: {
        where: {
          _id: query.id
        }
      }
    }
  )

  const {
    handleSubmit,
    control,
    reset,
    errors,
    register,
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(
      selectedStatus === 'draft' ? validationSchemaDraft : validationSchema
    ),
    defaultValues: {
      title: '',
      content: null,
      video: '',
      category: null,
      images: null
    }
  })

  register({ name: 'images' })

  useEffect(() => {
    if (errorPost) {
      showToast('danger', `Sorry, there's an error occured on fetching.`)
    } else if (!loadingPost && dataPost) {
      const itemData = dataPost?.getAllPost?.post[0]

      if (itemData) {
        setValue('title', itemData?.title)
        setValue('content', itemData?.content)
        setValue('category', itemData?.category?._id)
        setValue(
          'images',
          itemData?.primaryMedia.map(item => {
            return item.url
          })
        )
        setValue(
          'video',
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            null
        )
        setImageUploadedData(
          itemData?.primaryMedia.map(item => {
            return { url: item.url, type: item.type }
          })
        )
        setSelectedCategory(itemData?.category?._id)
        setVideoUrl(
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            ''
        )
        setImageUrls(itemData?.primaryMedia.map(item => item.url))
        setSelectedAudienceType(itemData?.audienceType)
        setSelectedCompanyExcept(
          itemData?.audienceExpanse
            ? {
                companyIds: itemData?.audienceExceptions?.company?.map(
                  item => item
                ),
                complexIds: itemData?.audienceExceptions?.complex?.map(
                  item => item
                ),
                buildingIds: itemData?.audienceExceptions?.building?.map(
                  item => item
                )
              }
            : null
        )
        setSelectedCompanySpecific(
          itemData?.audienceExpanse
            ? {
                companyIds: itemData?.audienceExpanse?.company?.map(
                  item => item
                ),
                complexIds: itemData?.audienceExpanse?.complex?.map(
                  item => item
                ),
                buildingIds: itemData?.audienceExpanse?.building?.map(
                  item => item
                )
              }
            : null
        )
      }
    }
  }, [loadingPost, dataPost, errorPost, setValue])

  useEffect(() => {
    if (!loadingUpdate) {
      if (errorUpdate) {
        showToast('danger', 'Sorry, an error occured during updating of post.')
      }
      if (calledUpdate && dataUpdate) {
        reset()
        resetForm()
        showToast('success', 'You have successfully updated a post.')

        if (modalType === 'preview') {
          goToPreviewPage()
        } else {
          goToBulletinPageLists()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate, reset])

  const goToBulletinPageLists = () => {
    push('/posts/')
  }

  const goToPreviewPage = () => {
    push(`/posts/view/${query.id}`)
  }

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const handleShowModal = type => {
    const selected = dataPost?.getAllPost?.post?.filter(
      item => item._id === query.id
    )

    if (selected) {
      setModalType(type)

      switch (type) {
        case 'delete': {
          setModalTitle('Delete Post')
          setModalContent(
            <UpdateCard type="trashed" title={selected[0].title} />
          )
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
        case 'preview': {
          setModalTitle('Preview Post')
          setModalContent(
            <UpdateCard type="preview" title={selected[0].title} />
          )
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
      }
      setShowModal(old => !old)
    }
  }

  const handleClearModal = () => {
    handleShowModal()
  }

  const uploadApi = async payload => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response.data) {
      const imageData = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype
        }
      })

      const combinedImages = [].concat(
        imageUrls,
        response.data.map(item => item.location)
      )
      const combinedUploadedImages = [].concat(imageUploadedData, imageData)

      setImageUrls(combinedImages)
      setImageUploadedData(combinedUploadedImages)
    }
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length > maxImages) {
        showToast('info', `Maximum of ${maxImages} files only`)
      } else {
        setLoading(true)
        for (const file of files) {
          const reader = new FileReader()

          reader.onloadend = () => {
            // setImageUrls(imageUrls => [...imageUrls, reader.result])
            setLoading(false)
          }
          reader.readAsDataURL(file)

          formData.append('photos', file)
          fileList.push(file)
        }
        setValue('images', fileList)

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
    setValue('images', images.length !== 0 ? images : null)
  }

  const onVideoChange = e => {
    setVideoLoading(true)
    setVideoError(null)
    setVideoUrl(e.target.value)
  }

  const onVideoError = () => {
    setVideoLoading(false)
    setVideoError('Invalid video link')
  }

  const onVideoClear = () => {
    setVideoUrl(null)
    setVideoLoading(false)
    setVideoError(null)
  }

  const onVideoReady = () => {
    setVideoLoading(false)
    setVideoError(null)
  }

  const onSubmit = (data, status) => {
    if (
      data?.title === '' &&
      data?.content === null &&
      data?.images === null &&
      data?.video === ''
    ) {
      showToast('info', `Ooops, it seems like there's no data to be saved.`)
    } else {
      const updateData = {
        id: query.id,
        data: {
          categoryId: data.category,
          title: data?.title || 'Untitled',
          content: data?.content,
          audienceType: selectedAudienceType,
          status: status,
          primaryMedia: imageUploadedData,
          embeddedMediaFiles: videoUrl
            ? [
                {
                  url: videoUrl
                }
              ]
            : null
        }
      }

      if (selectedPublishDateTime) {
        updateData.data.publishedAt = selectedPublishDateTime
      }
      if (selectedCompanySpecific) {
        updateData.data.audienceExpanse = {
          companyIds: selectedCompanySpecific
        }
      }
      if (selectedCompanyExcept) {
        updateData.data.audienceExceptions = {
          companyIds: selectedCompanyExcept
        }
      }
      updatePost({ variables: updateData })
    }
  }

  const onCategorySelect = e => {
    setSelectedCategory(e.value !== '' ? e.value : null)
  }

  const onClearCategory = () => {
    setSelectedCategory(null)
  }

  const onSelectType = data => {
    setSelectedAudienceType(data)
  }

  const onSelectCompanyExcept = data => {
    setSelectedCompanyExcept(data)
  }

  const onSelectCompanySpecific = data => {
    setSelectedCompanySpecific(data)
  }

  const handleShowAudienceModal = () => {
    setShowAudienceModal(old => !old)
  }

  const onSaveAudience = () => {
    handleShowAudienceModal()
  }

  const onCancelAudience = () => {
    setSelectedAudienceType('all')
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(null)
    handleShowAudienceModal()
  }

  const handleShowPublishTimeModal = () => {
    setShowPublishTimeModal(old => !old)
  }
  const onSelectPublishTimeType = data => {
    setSelectedPublishTimeType(data)
  }

  const onSelectPublishDateTime = data => {
    setSelectedPublishDateTime(data)
  }

  const onSavePublishTime = () => {
    handleShowPublishTimeModal()
  }

  const onCancelPublishTime = () => {
    setSelectedPublishDateTime(new Date())
    setSelectedPublishTimeType('now')
    handleShowPublishTimeModal()
  }

  const resetForm = () => {
    setLoading(false)
    setImageUrls([])
    setImageUploadedData([])
    setVideoUrl(null)
    setVideoError(null)
    setVideoLoading(false)
    setTextCount(0)
    setShowAudienceModal(false)
    setShowPublishTimeModal(false)
    setSelectedCategory(null)
    setSelectedAudienceType('all')
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(null)
    setSelectedPublishTimeType('now')
    setSelectedPublishDateTime(null)
    setSelectedStatus('active')
  }

  const onUpdateStatus = data => {
    setSelectedStatus(data)
  }

  const onDeletePost = async () => {
    const updateData = {
      id: modalID,
      data: {
        status: 'trashed'
      }
    }

    try {
      await updatePost({ variables: updateData })
    } catch (e) {
      console.log(e)
    }
  }

  const onPreviewPost = () => {
    onSubmit(getValues(), 'draft')
  }

  return (
    <div className={style.CreatePostContainer}>
      <h1 className={style.CreatePostHeader}>Create a Post</h1>
      <form>
        <Card
          header={<span className={style.CardHeader}>Featured Media</span>}
          content={
            <div className={style.CreateContentContainer}>
              <UploaderImage
                name="image"
                multiple
                maxImages={maxImages}
                images={imageUrls}
                loading={loading}
                error={errors?.images?.message ?? null}
                onUploadImage={onUploadImage}
                onRemoveImage={onRemoveImage}
              />
            </div>
          }
        />

        <Card
          content={
            <div className={style.CreateContentContainer}>
              <h2 className={style.CreatePostHeaderSmall}>Title</h2>
              <div className={style.CreatePostSubContent}>
                <div className={style.CreatePostSubContentGrow}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ name, value, onChange }) => (
                      <FormInput
                        inputClassName={style.CreatePostInputCustom}
                        type="text"
                        name={name}
                        value={value}
                        placeholder="What's the title of your bulletin post?"
                        maxLength={inputMaxLength}
                        count={textCount}
                        error={errors?.title?.message ?? null}
                        onChange={e => {
                          onChange(e)
                          onCountChar(e)
                        }}
                      />
                    )}
                  />
                </div>
                <div className={style.CreatePostCounter}>
                  {textCount}/{inputMaxLength}
                </div>
              </div>
              <h2 className={style.CreatePostHeaderSmall}>Content</h2>
              <Controller
                name="content"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormTextArea
                    options={['link', 'history']}
                    placeholder="Write your text here"
                    value={value}
                    error={errors?.content?.message ?? null}
                    onChange={e => {
                      onChange(e)
                      setIsEdit(false)
                    }}
                    isEdit={isEdit}
                  />
                )}
              />
            </div>
          }
        />

        <Card
          header={<span className={style.CardHeader}>Embed Video</span>}
          content={
            <div className={style.CreateContentContainer}>
              <h2 className={style.CreatePostVideoHeader}>
                Include a video in your bulletin post by linking a YouTube or
                Facebook video.
              </h2>
              <div className={style.CreatePostCardContent}>
                <div className={style.CreatePostVideoInput}>Video Link</div>
                <div className={style.CreatePostVideoInputContent}>
                  <div className="flex-grow">
                    <Controller
                      name="video"
                      control={control}
                      render={({ name, value, onChange }) => (
                        <FormInput
                          name={name}
                          placeholder="Add Youtube link here"
                          value={videoUrl}
                          error={errors?.video?.message ?? null}
                          onBlur={onCountChar}
                          onChange={e => {
                            onChange(e)
                            onVideoChange(e)
                          }}
                        />
                      )}
                    />
                  </div>
                  <FaTimes
                    className={`${style.CreatePostVideoButtonClose} ${
                      videoUrl ? 'visible' : 'invisible'
                    }  `}
                    onClick={onVideoClear}
                  />
                  <FaSpinner
                    className={`${style.CreatePostVideoLoading} icon-spin ${
                      videoLoading ? 'visible' : 'invisible'
                    }  `}
                  />
                </div>
              </div>
              {videoUrl && !videoError && (
                <VideoPlayer
                  url={videoUrl}
                  onError={onVideoError}
                  onReady={onVideoReady}
                />
              )}

              {videoError && <p className={style.TextError}>{videoError}</p>}
            </div>
          }
        />

        <Card
          header={<span className={style.CardHeader}>Category</span>}
          content={
            <div className={style.CreateContentContainer}>
              <div className={style.CreatePostCardContent}>
                <Controller
                  name="category"
                  control={control}
                  render={({ name, value, onChange }) => (
                    <SelectCategory
                      placeholder="Select a Category"
                      type="post"
                      userType="administrator"
                      onChange={e => {
                        onChange(e.value)
                        onCategorySelect(e)
                      }}
                      onClear={onClearCategory}
                      error={errors?.category?.message ?? null}
                      selected={selectedCategory}
                    />
                  )}
                />
              </div>
            </div>
          }
        />

        <Card
          header={<span className={style.CardHeader}>Publish Details</span>}
          content={
            <div className={style.CreateContentContainer}>
              <div className={style.CreatePostPublishContent}>
                <div className={style.CreatePostPublishSubContent}>
                  <span>
                    Status: <strong>New</strong>
                  </span>
                  <span className="flex flex-col">
                    <div>
                      Audience:
                      <strong>
                        {selectedAudienceType === 'allExcept'
                          ? ' All those registered except: '
                          : selectedAudienceType === 'specific'
                          ? ' Only show to those selected: '
                          : ' All those registered '}
                      </strong>
                      {selectedAudienceType === 'all' && (
                        <span
                          className={style.CreatePostLink}
                          onClick={handleShowAudienceModal}
                        >
                          Edit
                        </span>
                      )}
                    </div>

                    {(selectedAudienceType === 'allExcept' ||
                      selectedAudienceType === 'specific') && (
                      <div className="ml-20">
                        <strong>
                          {selectedCompanyExcept && (
                            <div>{`Companies (${selectedCompanyExcept?.length}) `}</div>
                          )}
                          {selectedCompanySpecific && (
                            <div>{`Companies (${selectedCompanySpecific?.length}) `}</div>
                          )}
                        </strong>
                        <span
                          className={style.CreatePostLink}
                          onClick={handleShowAudienceModal}
                        >
                          Edit
                        </span>
                      </div>
                    )}
                  </span>
                </div>

                <div className={style.CreatePostPublishMarginContainer}>
                  Publish:
                  <strong>
                    {selectedPublishTimeType === 'later'
                      ? ` Scheduled, ${moment(selectedPublishDateTime).format(
                          'MMM DD, YYYY - hh:mm A'
                        )} `
                      : ' Immediately '}
                  </strong>
                  <span
                    className={style.CreatePostLink}
                    onClick={handleShowPublishTimeModal}
                  >
                    Edit
                  </span>
                </div>
                <span />
              </div>
            </div>
          }
        />

        <div className={style.CreatePostFooter}>
          <Button
            default
            type="button"
            label="Move to Trash"
            className={style.CreatePostFooterButton}
            onMouseDown={() => onUpdateStatus('draft')}
            onClick={handleSubmit(e => {
              handleShowModal('delete')
            })}
          />
          <span>
            <Button
              default
              type="button"
              label="Preview"
              className={style.CreatePostFooterButton}
              onMouseDown={() => onUpdateStatus('draft')}
              onClick={handleSubmit(e => {
                handleShowModal('preview')
              })}
            />
            <Button
              type="button"
              label="Publish Post"
              primary
              onMouseDown={() => onUpdateStatus('active')}
              onClick={handleSubmit(e => {
                onSubmit(e, 'active')
              })}
            />
          </span>
        </div>
      </form>

      <AudienceModal
        onSelectAudienceType={onSelectType}
        onSelectCompanyExcept={onSelectCompanyExcept}
        onSelectCompanySpecific={onSelectCompanySpecific}
        // onSelectComplexExcept={onSelectComplexExcept}
        // onSelectComplexSpecific={onSelectComplexSpecific}
        // onSelectBuildingExcept={onSelectBuildingExcept}
        // onSelectBuildingSpecific={onSelectBuildingSpecific}
        onSave={onSaveAudience}
        onCancel={onCancelAudience}
        onClose={onCancelAudience}
        isShown={showAudienceModal}
      />

      <PublishTimeModal
        onSelectType={onSelectPublishTimeType}
        onSelectDateTime={onSelectPublishDateTime}
        onSave={onSavePublishTime}
        onCancel={onCancelPublishTime}
        onClose={onCancelPublishTime}
        isShown={showPublishTimeModal}
      />

      <Modal
        title={modalTitle}
        visible={showModal}
        onClose={handleClearModal}
        footer={modalFooter}
        okText={
          modalType === 'delete'
            ? 'Yes, move to trash'
            : modalType === 'preview'
            ? 'Save & Continue'
            : 'Yes'
        }
        onOk={() =>
          modalType === 'delete'
            ? onDeletePost()
            : modalType === 'preview'
            ? onPreviewPost()
            : null
        }
        onCancel={() => setShowModal(old => !old)}
      >
        <div className="w-full">{modalContent}</div>
      </Modal>
    </div>
  )
}

export default CreatePosts