/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import axios from 'axios'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'
import Datetime from 'react-datetime'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'
import Modal from '@app/components/modal'
import PageLoader from '@app/components/page-loader'

import { DATE } from '@app/utils'

import VideoPlayer from '@app/components/globals/VideoPlayer'
import SelectCategory from '@app/components/globals/SelectCategory'

import showToast from '@app/utils/toast'

import UpdateCard from './components/UpdateCard'
import AudienceModal from './components/AudienceModal'
import PublishTimeModal from './components/PublishTimeModal'
import Can from '@app/permissions/can'
import style from './Create.module.css'

const CREATE_POST_MUTATION = gql`
  mutation($data: PostInput) {
    createPost(data: $data) {
      _id
      processId
      message
    }
  }
`
const validationSchema = yup.object().shape({
  title: yup
    .string()
    .label('Title')
    .nullable()
    .trim()
    .test('len', 'Must be up to 120 characters only', val => val.length <= 120)
    .required(),
  content: yup.mixed().label('Content').nullable().required(),
  images: yup.array().label('Image').nullable(),
  category: yup.string().label('Category').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  date: yup.string(),
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 120 characters only', val => val.length <= 120),
  content: yup.mixed().nullable(),
  category: yup.string().nullable()
})

const validationSchemaDailyReadings = yup.object().shape({
  title: yup
    .string()
    .label('Title')
    .nullable()
    .trim()
    .test('len', 'Must be up to 120 characters only', val => val.length <= 120)
    .required(),
  content: yup.mixed().label('Content').nullable().required(),
  images: yup.array().label('Image').nullable()
})

const CreatePosts = () => {
  const { push, pathname } = useRouter()
  const [loading, setLoading] = useState(false)
  const [maxImages] = useState(3)
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [videoUrl, setVideoUrl] = useState()
  const [videoError, setVideoError] = useState()
  const [videoLoading, setVideoLoading] = useState(false)
  const [inputMaxLength] = useState(120)
  const [textCount, setTextCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [modalFooter, setModalFooter] = useState(null)
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const [showPublishTimeModal, setShowPublishTimeModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedAudienceType, setSelectedAudienceType] = useState('all')
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()
  const [selectedComplexExcept, setSelectedComplexExcept] = useState()
  const [selectedComplexSpecific, setSelectedComplexSpecific] = useState()
  const [selectedBuildingExcept, setSelectedBuildingExcept] = useState()
  const [selectedBuildingSpecific, setSelectedBuildingSpecific] = useState()
  const [selectedPublishTimeType, setSelectedPublishTimeType] = useState('now')
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState()
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const isAttractionsEventsPage = pathname === '/attractions-events/create'
  const isQRCodePage = pathname === '/qr-code/create'
  const isDailyReadingsPage = pathname === '/daily-readings/create'
  const routeName = isAttractionsEventsPage
    ? 'attractions-events'
    : isQRCodePage
    ? 'qr-code'
    : isDailyReadingsPage
    ? 'daily-readings'
    : 'posts'

  const [
    createPost,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_POST_MUTATION, {
    onError: _e => {}
  })

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
      selectedStatus === 'draft'
        ? validationSchemaDraft
        : isDailyReadingsPage
        ? validationSchemaDailyReadings
        : validationSchema
    ),
    defaultValues: {
      date: selectedDate,
      title: '',
      content: null,
      video: '',
      category: null,
      images: null
    }
  })

  register({ name: 'images' })

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        let message

        reset()
        resetForm()
        goToBulletinPageLists()

        switch (selectedStatus) {
          case 'draft':
            message = `You have successfully draft a post.`
            break
          default:
            message = `You have successfully created a post.`
            break
        }

        showToast('success', message)
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate, reset])

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const goToBulletinPageLists = () => {
    push(`/${routeName}`)
  }

  const handleShowModal = type => {
    setModalType(type)

    switch (type) {
      case 'preview': {
        setModalTitle('Preview Post')
        setModalContent(<UpdateCard type="preview" />)
        setModalFooter(true)
        break
      }
    }
    setShowModal(old => !old)
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

      setImageUploadedData(imageData)
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
            setImageUrls(imageUrls => [...imageUrls, reader.result])
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
    setImageUrls(images)
    setValue('images', images.length !== 0 ? images : null)
  }

  const onVideoChange = e => {
    setVideoLoading(e.target.value !== '')
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
      const createData = {
        type: 'post',
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

      if (selectedPublishDateTime) {
        createData.publishedAt = selectedPublishDateTime
      }
      if (selectedCompanySpecific) {
        createData.audienceExpanse = {
          companyIds: selectedCompanySpecific.map(item => item.value)
        }
      }
      if (selectedCompanyExcept) {
        createData.audienceExceptions = {
          companyIds: selectedCompanyExcept.map(item => item.value)
        }
      }
      if (selectedComplexSpecific) {
        createData.audienceExpanse = {
          complexIds: selectedComplexSpecific.map(item => item.value)
        }
      }
      if (selectedComplexExcept) {
        createData.audienceExceptions = {
          complexIds: selectedComplexExcept.map(item => item.value)
        }
      }
      if (selectedBuildingSpecific) {
        createData.audienceExpanse = {
          buildingIds: selectedBuildingSpecific.map(item => item.value)
        }
      }
      if (selectedBuildingExcept) {
        createData.audienceExceptions = {
          buildingIds: selectedBuildingExcept.map(item => item.value)
        }
      }
      if (isQRCodePage) {
        createData.qr = true
      }
      if (isDailyReadingsPage) {
        createData.type = 'daily_reading'
        createData.dailyReadingDate = DATE.toFriendlyISO(
          DATE.setInitialTime(selectedDate)
        )
      }
      createPost({ variables: { data: createData } })
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

  const onSelectComplexExcept = data => {
    setSelectedComplexExcept(data)
  }

  const onSelectComplexSpecific = data => {
    setSelectedComplexSpecific(data)
  }

  const onSelectBuildingExcept = data => {
    setSelectedBuildingExcept(data)
  }

  const onSelectBuildingSpecific = data => {
    setSelectedBuildingSpecific(data)
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
    setSelectedComplexExcept(null)
    setSelectedComplexSpecific(null)
    setSelectedBuildingExcept(null)
    setSelectedBuildingSpecific(null)
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
    setSelectedComplexExcept(null)
    setSelectedComplexSpecific(null)
    setSelectedBuildingExcept(null)
    setSelectedBuildingSpecific(null)
    setSelectedPublishTimeType('now')
    setSelectedPublishDateTime(null)
    setSelectedStatus('active')
  }

  const onUpdateStatus = data => {
    setSelectedStatus(data)
  }

  const onPreviewPost = () => {
    onSubmit(getValues(), 'draft')
  }

  const handleDateChange = e => {
    setSelectedDate(e)
  }

  return (
    <>
      {loadingCreate && <PageLoader fullPage />}
      <div className={style.CreatePostContainer}>
        <h1 className={style.CreatePostHeader}>
          {isDailyReadingsPage ? 'Create Daily Reading' : 'Create a Post'}
        </h1>
        <form>
          <Card
            header={
              <span className={style.CardHeader}>
                Featured Media (optional)
              </span>
            }
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
                {isDailyReadingsPage && (
                  <>
                    <h2 className={style.CreatePostHeaderSmall}>
                      Daily Reading Date
                    </h2>
                    <div className={style.CreatePostCardContent}>
                      <div className={style.CreatePostSubContent}>
                        <Controller
                          name="date"
                          control={control}
                          render={({ name, value, onChange }) => (
                            <Datetime
                              renderInput={(props, openCalendar) => (
                                <>
                                  <div className="relative">
                                    <FormInput
                                      {...props}
                                      inputClassName={
                                        style.CreatePostInputCustom
                                      }
                                      name="date"
                                      value={moment(selectedDate).format(
                                        'MMM DD, YYYY'
                                      )}
                                      error={errors?.date?.message ?? null}
                                      readOnly
                                    />
                                    <i
                                      className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
                                      onClick={openCalendar}
                                    />
                                  </div>
                                </>
                              )}
                              dateFormat="MMMM DD, YYYY"
                              timeFormat={false}
                              value={selectedDate}
                              closeOnSelect
                              onChange={e => {
                                onChange(e)
                                handleDateChange(e)
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                <h2 className={style.CreatePostHeaderSmall}>
                  {isDailyReadingsPage ? 'Daily Reading Title' : 'Title'}
                </h2>
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
                      options={[
                        'inline',
                        'list',
                        'link',
                        'colorPicker',
                        'history'
                      ]}
                      placeholder="Write your text here"
                      value={value}
                      error={errors?.content?.message ?? null}
                      onChange={onChange}
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
                      <Can
                        perform="bulletin:embed"
                        yes={
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
                        }
                      />
                      {videoError && (
                        <p className={style.TextError}>{videoError}</p>
                      )}
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
              </div>
            }
          />

          {!isDailyReadingsPage && (
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
          )}

          <Card
            header={<span className={style.CardHeader}>Publish Details</span>}
            content={
              <div className={style.CreateContentContainer}>
                <div className={style.CreatePostPublishContent}>
                  <div className={style.CreatePostPublishSubContent}>
                    <span className="flex">
                      <span className={style.CreatePostSection}>Status: </span>
                      <strong>New</strong>
                    </span>
                    <span className="flex flex-col">
                      <div className="flex">
                        <span className={style.CreatePostSection}>
                          Audience:{' '}
                        </span>
                        <span className="mr-2">
                          <strong>
                            {selectedAudienceType === 'allExcept'
                              ? ' All those registered except'
                              : selectedAudienceType === 'specific'
                              ? ' Only show to those selected'
                              : ' All those registered'}
                          </strong>
                        </span>
                        {(systemType === 'home' ||
                          (systemType !== 'home' &&
                            accountType !== 'complex_admin')) && (
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
                        <div className="flex">
                          <span className={style.CreatePostSection} />
                          <span>
                            <strong>
                              {selectedCompanyExcept && (
                                <div>{`Companies (${selectedCompanyExcept?.length}) `}</div>
                              )}
                              {selectedCompanySpecific && (
                                <div>{`Companies (${selectedCompanySpecific?.length}) `}</div>
                              )}
                              {selectedComplexExcept && (
                                <div>{`Complexes (${selectedComplexExcept?.length}) `}</div>
                              )}
                              {selectedComplexSpecific && (
                                <div>{`Complexes (${selectedComplexSpecific?.length}) `}</div>
                              )}
                              {selectedBuildingExcept && (
                                <div>{`Buildings (${selectedBuildingExcept?.length}) `}</div>
                              )}
                              {selectedBuildingSpecific && (
                                <div>{`Buildings (${selectedBuildingSpecific?.length}) `}</div>
                              )}
                            </strong>
                          </span>
                        </div>
                      )}
                    </span>
                  </div>

                  <div className="flex">
                    <span className={style.CreatePostSection}>Publish: </span>
                    <span className="mr-2">
                      <strong>
                        {selectedPublishTimeType === 'later'
                          ? ` Scheduled, ${moment(
                              selectedPublishDateTime
                            ).format('MMM DD, YYYY - hh:mm A')} `
                          : ' Immediately'}
                      </strong>
                    </span>
                    {!isDailyReadingsPage && (
                      <span
                        className={style.CreatePostLink}
                        onClick={handleShowPublishTimeModal}
                      >
                        Edit
                      </span>
                    )}
                  </div>
                  <span />
                </div>
              </div>
            }
          />

          <div className={style.CreatePostFooter}>
            {isDailyReadingsPage ? (
              <span></span>
            ) : (
              <Can
                perform="bulletin:draft"
                yes={
                  <Button
                    default
                    type="button"
                    label="Save as Draft"
                    className={style.CreatePostFooterButton}
                    onMouseDown={() => onUpdateStatus('draft')}
                    onClick={handleSubmit(e => {
                      onSubmit(e, 'draft')
                    })}
                  />
                }
                no={
                  <Button
                    disabled
                    default
                    type="button"
                    label="Save as Draft"
                    className={style.CreatePostFooterButton}
                  />
                }
              />
            )}

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
                label={
                  isQRCodePage
                    ? 'Generate QR and Publish'
                    : isDailyReadingsPage
                    ? 'Publish'
                    : 'Publish Post'
                }
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
          onSelectComplexExcept={onSelectComplexExcept}
          onSelectComplexSpecific={onSelectComplexSpecific}
          onSelectBuildingExcept={onSelectBuildingExcept}
          onSelectBuildingSpecific={onSelectBuildingSpecific}
          onSave={onSaveAudience}
          onCancel={onCancelAudience}
          onClose={onCancelAudience}
          isShown={showAudienceModal}
          valueAudienceType={selectedAudienceType}
          valueCompanyExcept={selectedCompanyExcept}
          valueCompanySpecific={selectedCompanySpecific}
          valueComplexExcept={selectedComplexExcept}
          valueComplexSpecific={selectedComplexSpecific}
          valueBuildingExcept={selectedBuildingExcept}
          valueBuildingSpecific={selectedBuildingSpecific}
        />

        <PublishTimeModal
          onSelectType={onSelectPublishTimeType}
          onSelectDateTime={onSelectPublishDateTime}
          onSave={onSavePublishTime}
          onCancel={onCancelPublishTime}
          onClose={onCancelPublishTime}
          isShown={showPublishTimeModal}
          valuePublishType={selectedPublishTimeType}
          valueDateTime={selectedPublishDateTime}
        />

        <Modal
          title={modalTitle}
          visible={showModal}
          onClose={handleClearModal}
          footer={modalFooter}
          okText={
            modalType === 'draft'
              ? 'Yes, move to trash'
              : modalType === 'preview'
              ? 'Save & Continue'
              : 'Yes'
          }
          onOk={() => (modalType === 'preview' ? onPreviewPost() : null)}
          onCancel={() => setShowModal(old => !old)}
        >
          <div className="w-full">{modalContent}</div>
        </Modal>
      </div>
    </>
  )
}

export default CreatePosts
