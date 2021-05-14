/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import axios from 'axios'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { FiVideo, FiFilm } from 'react-icons/fi'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import Datetime from 'react-datetime'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'
import FileUpload from '@app/components/uploader/simple'
import Modal from '@app/components/modal'
import PageLoader from '@app/components/page-loader'
import ProgressBar from '@app/components/progress-bar'

import { DATE } from '@app/utils'
import { ACCOUNT_TYPES } from '@app/constants'

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
  category: yup.string().label('Category').nullable().required(),
  embeddedVideo: yup.array().label('File').nullable()
})

const validationSchemaDraft = yup.object().shape({
  date: yup.string(),
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 120 characters only', val => val.length <= 120),
  content: yup.mixed().nullable(),
  category: yup.string().nullable(),
  embeddedVideo: yup.string().nullable()
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
  const [fileLoading, setFileLoading] = useState(false)
  const [fileFormData, setFileFormData] = useState(false)
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [maxImages] = useState(3)
  const [maxFiles] = useState(1)
  const [fileMaxSize] = useState(104857600) // 100MB
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fileUrls, setFileUrls] = useState([])
  const [imageUploadError, setImageUploadError] = useState()
  const [fileUploadError, setFileUploadError] = useState()
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
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState(
    new Date()
  )
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [errorSelectedDate, setErrorSelectedDate] = useState()
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = system === 'pray'
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
      images: null,
      embeddedVideo: null
    }
  })

  register({ name: 'images' })
  register({ name: 'videos' })

  useEffect(() => {
    resetAudienceSpecific()
  }, [])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        let message

        if (modalType === 'preview') {
          goToPreviewPage(dataCreate?.createPost?._id)
        }
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

  const goToPreviewPage = id => {
    window.open(`/${routeName}/view/${id}`, '_blank')
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
    await axios
      .post(process.env.NEXT_PUBLIC_UPLOAD_API, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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
        setValue('images', null)
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

        if (errors?.images?.message) {
          errors.images.message = null
        }

        for (const file of files) {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          formData.append('files', file)
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
    setSelectedFiles([])
    setFileUrls([])
    setFileUploadedData([])
    setValue('embeddedVideo', null)
  }

  const onVideoReady = () => {
    setVideoLoading(false)
    setVideoError(null)
  }

  const onAddFile = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      let maxSize = 0
      for (const file of files) {
        if (file.size > fileMaxSize) {
          maxSize++
        }
      }

      if (files.length + fileUrls?.length > maxFiles) {
        showToast('info', `Maximum of ${maxFiles} files only`)
      } else if (maxSize > 0) {
        showToast('info', `Maximum size of ${fileMaxSize / 1024 / 1024}mb only`)
      } else {
        setFileUploadError(null)

        if (errors?.embeddedVideo?.message) {
          errors.embeddedVideo.message = null
        }

        for (const file of files) {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          formData.append('videos', file)
          fileList.push(file)
        }
        setValue('embeddedVideo', fileList)
        setSelectedFiles(fileList)
        setFileFormData(formData)
      }
    }
  }

  const onRemoveFile = e => {
    setSelectedFiles([])
    setFileUrls([])
    setFileUploadedData([])
    setValue('embeddedVideo', null)
    setValue('video', null)
    setVideoUrl(null)
  }

  const onUploadFile = () => {
    setFileLoading(true)
    setFileUploadError(null)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        const { loaded, total } = progressEvent
        const percent = Math.floor((loaded * 100) / total)
        console.log(`${loaded}kb of ${total}kb | ${percent}%`)

        if (percent < 100) {
          setUploadPercentage(percent)
        }
      }
    }

    axios
      .post(process.env.NEXT_PUBLIC_UPLOAD_VIDEO_API, fileFormData, config)
      .then(function (response) {
        if (response.data) {
          response.data.map(item => {
            setFileUrls([item.location])
            return setFileUploadedData([
              {
                url: item.location
              }
            ])
          })
          setFileUploadError(null)
        }
      })
      .catch(function (error) {
        const errMsg = 'Failed to upload file. Please try again.'
        console.log(error)
        showToast('danger', errMsg)
        setFileUploadError(errMsg)
        setValue('videos', null)
      })
      .then(() => {
        setFileLoading(false)
      })
  }

  const onSubmit = (data, status) => {
    if (
      data?.title === '' &&
      (data?.content === null || data?.content === '') &&
      data?.images === null &&
      data?.video === ''
    ) {
      showToast('info', `Ooops, it seems like there's no data to be saved.`)
    } else {
      const createData = {
        type: 'post',
        categoryId: data.category,
        title: data?.title || 'Untitled',
        content:
          data?.content === ''
            ? null
            : data?.content?.replace(/(&nbsp;)+/g, ''),
        audienceType: selectedAudienceType,
        status:
          !dayjs().isAfter(dayjs(new Date(selectedPublishDateTime))) &&
          status !== 'draft'
            ? 'scheduled'
            : status,
        primaryMedia: imageUploadedData,
        embeddedMediaFiles: videoUrl
          ? [
              {
                url: videoUrl
              }
            ]
          : fileUploadedData?.length > 0
          ? fileUploadedData
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
          DATE.addTime(DATE.setInitialTime(selectedDate), 'hours', 8)
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

    if (data === 'all') {
      resetAudienceSpecific()
    }
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
    setSelectedComplexExcept(null)
    setSelectedBuildingExcept(null)
    resetAudienceSpecific()
    handleShowAudienceModal()
  }

  const handleShowPublishTimeModal = () => {
    setShowPublishTimeModal(old => !old)
  }
  const onSelectPublishTimeType = data => {
    setSelectedPublishTimeType(data)
  }

  const onSelectPublishDateTime = data => {
    const isIn = dayjs(DATE.toFriendlyISO(data)).diff(new Date(), 'minutes')

    if (isIn < 5) {
      setErrorSelectedDate('Requires at least 5 minutes')
    } else {
      setErrorSelectedDate(null)
    }
    setSelectedPublishDateTime(data)
  }

  const onSavePublishTime = () => {
    const isIn = dayjs(DATE.toFriendlyISO(selectedPublishDateTime)).diff(
      new Date(),
      'minutes'
    )

    if (isIn < 5) {
      setErrorSelectedDate('Requires at least 5 minutes')
    } else {
      setErrorSelectedDate(null)
      handleShowPublishTimeModal()
    }
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
    setSelectedComplexExcept(null)
    setSelectedBuildingExcept(null)
    setSelectedPublishTimeType('now')
    setSelectedPublishDateTime(null)
    setSelectedStatus('active')
    resetAudienceSpecific()
  }

  const resetAudienceSpecific = () => {
    if (accountType === ACCOUNT_TYPES.COMPYAD.value) {
      const companyID = user?.accounts?.data[0]?.company?._id
      setSelectedCompanySpecific([{ value: companyID }])
      setSelectedComplexSpecific(null)
      setSelectedBuildingSpecific(null)
    } else if (accountType === ACCOUNT_TYPES.COMPXAD.value) {
      const complexID = user?.accounts?.data[0]?.complex?._id
      setSelectedComplexSpecific([{ value: complexID }])
      setSelectedCompanySpecific(null)
      setSelectedBuildingSpecific(null)
    } else if (accountType === ACCOUNT_TYPES.BUIGAD.value) {
      const buildingID = user?.accounts?.data[0]?.building?._id
      setSelectedBuildingSpecific([{ value: buildingID }])
    } else if (accountType === ACCOUNT_TYPES.RECEP.value) {
      const buildingID = user?.accounts?.data[0]?.building?._id
      setSelectedBuildingSpecific([{ value: buildingID }])
      setSelectedCompanySpecific(null)
      setSelectedComplexSpecific(null)
    }
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
                  error={errors?.images?.message ?? imageUploadError ?? null}
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
                                      inputProps={{
                                        style: { backgroundColor: 'white' }
                                      }}
                                      inputClassName={
                                        style.CreatePostInputCustom
                                      }
                                      name="date"
                                      value={dayjs(selectedDate).format(
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
                {fileUrls?.length === 0 && (
                  <>
                    <h2 className={style.CreatePostVideoHeader}>
                      Include a video in your bulletin post by linking a YouTube
                      video.
                    </h2>
                    <div className={style.CreatePostCardContent}>
                      <div className="flex items-start">
                        <FiVideo className={style.CreateVideoIcon} />
                        <div>
                          <div className={style.CreatePostVideoInput}>
                            Video Link
                          </div>
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
                                        value={videoUrl || ''}
                                        error={errors?.video?.message ?? null}
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
                              className={`${
                                style.CreatePostVideoLoading
                              } icon-spin ${
                                videoLoading ? 'visible' : 'invisible'
                              }  `}
                            />
                          </div>
                        </div>
                      </div>

                      {isSystemPray && !videoUrl && (
                        <div className="flex items-start">
                          <FiFilm className={style.CreateVideoIcon} />
                          <div>
                            <div className={style.CreatePostVideoInput}>
                              <div>or select a video from your computer:</div>
                              <div className="text-neutral-600 font-normal">
                                MP4, AVI, MPEG, MOV are accepted.
                              </div>
                              <div className="text-neutral-600 font-normal">
                                Max file size:
                                <strong> {fileMaxSize / 1024 / 1024}MB</strong>
                              </div>
                            </div>
                            <Can
                              perform="bulletin:embed"
                              yes={
                                <Controller
                                  name="embeddedVideo"
                                  control={control}
                                  render={({ name, value, onChange }) => (
                                    <FileUpload
                                      label="Upload File"
                                      accept=".mp4, .avi, .mpeg, .mov"
                                      maxSize={fileMaxSize}
                                      files={selectedFiles}
                                      onUpload={onAddFile}
                                      onRemove={onRemoveFile}
                                    />
                                  )}
                                />
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {(fileUrls?.length > 0 || videoUrl) && !videoError && (
                  <>
                    <div className="flex items-start">
                      <FiFilm className={style.CreateVideoIcon} />
                      <div className={style.CreatePostVideoInput}>
                        Preview Video
                      </div>
                    </div>

                    <VideoPlayer
                      url={videoUrl || fileUrls[0]}
                      onError={onVideoError}
                      onReady={onVideoReady}
                    />

                    <Button
                      className="mt-4"
                      default
                      type="button"
                      label="Replace Video"
                      onClick={onRemoveFile}
                    />
                  </>
                )}
              </div>
            }
            footer={
              selectedFiles?.length > 0 &&
              fileUrls?.length === 0 && (
                <div className="flex items-center">
                  <Button
                    className="mr-4 mb-0"
                    primary
                    type="button"
                    label={fileLoading ? 'Uploading Video...' : 'Upload Video'}
                    onClick={onUploadFile}
                    disabled={fileLoading}
                    style={{ marginBottom: 0 }}
                  />
                  {fileLoading && (
                    <>
                      <FaSpinner className="mx-2 icon-spin" />
                      {/* hidden for future use */}
                      {/* <ProgressBar value={uploadPercentage} />  */}
                    </>
                  )}
                  {fileUploadError && (
                    <div className="my-4 text-danger-500 text-md font-bold">
                      {fileUploadError}
                    </div>
                  )}
                </div>
              )
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
                            accountType !== ACCOUNT_TYPES.COMPXAD.value)) && (
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
                              {accountType !== ACCOUNT_TYPES.COMPYAD.value && (
                                <>
                                  {selectedCompanyExcept && (
                                    <div>{`Companies (${selectedCompanyExcept?.length}) `}</div>
                                  )}
                                  {selectedCompanySpecific && (
                                    <div>{`Companies (${selectedCompanySpecific?.length}) `}</div>
                                  )}
                                </>
                              )}

                              {accountType !== ACCOUNT_TYPES.COMPXAD.value && (
                                <>
                                  {selectedComplexExcept && (
                                    <div>{`Complexes (${selectedComplexExcept?.length}) `}</div>
                                  )}
                                  {selectedComplexSpecific && (
                                    <div>{`Complexes (${selectedComplexSpecific?.length}) `}</div>
                                  )}
                                </>
                              )}

                              {accountType !== ACCOUNT_TYPES.BUIGAD.value && (
                                <>
                                  {selectedBuildingExcept && (
                                    <div>{`Buildings (${selectedBuildingExcept?.length}) `}</div>
                                  )}
                                  {selectedBuildingSpecific && (
                                    <div>{`Buildings (${selectedBuildingSpecific?.length}) `}</div>
                                  )}
                                </>
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
                          ? ` Scheduled, ${dayjs(
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
                  disabled={loading || fileLoading}
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
                disabled={loading || fileLoading}
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
                disabled={loading || fileLoading}
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
          errorSelectedDate={errorSelectedDate}
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
