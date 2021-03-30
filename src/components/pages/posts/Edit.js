/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation, useQuery } from '@apollo/client'
import axios from 'axios'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'
import QRCode from 'react-qr-code'
import Datetime from 'react-datetime'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'
import Modal from '@app/components/modal'
import PageLoader from '@app/components/page-loader'

import VideoPlayer from '@app/components/globals/VideoPlayer'
import SelectCategory from '@app/components/globals/SelectCategory'

import showToast from '@app/utils/toast'
import { DATE } from '@app/utils'

import UpdateCard from './components/UpdateCard'
import AudienceModal from './components/AudienceModal'
import PublishTimeModal from './components/PublishTimeModal'
import Can from '@app/permissions/can'
import style from './Create.module.css'

const saveSvgAsPng = require('save-svg-as-png')

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
            _id
          }
          complex {
            _id
          }
          building {
            _id
          }
        }
        audienceExceptions {
          company {
            _id
          }
          complex {
            _id
          }
          building {
            _id
          }
        }
        dailyReadingDate
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
    .test('len', 'Must be up to 120 characters only', val => val.length <= 120)
    .required(),
  content: yup.string().label('Content').nullable().required(),
  images: yup.array().label('Image').nullable(),
  category: yup.string().label('Category').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
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
  content: yup.string().label('Content').nullable().required(),
  images: yup.array().label('Image').nullable()
})

const CreatePosts = () => {
  const { query, push, pathname } = useRouter()
  const [loading, setLoading] = useState(false)
  const [maxImages] = useState(3)
  const [post, setPost] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [videoUrl, setVideoUrl] = useState()
  const [videoError, setVideoError] = useState()
  const [videoLoading, setVideoLoading] = useState(false)
  const [inputMaxLength] = useState(120)
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
  const [selectedComplexExcept, setSelectedComplexExcept] = useState()
  const [selectedComplexSpecific, setSelectedComplexSpecific] = useState()
  const [selectedBuildingExcept, setSelectedBuildingExcept] = useState()
  const [selectedBuildingSpecific, setSelectedBuildingSpecific] = useState()
  const [selectedPublishTimeType, setSelectedPublishTimeType] = useState('now')
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState()
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isEdit, setIsEdit] = useState(true)
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const isAttractionsEventsPage = pathname === '/attractions-events/edit/[id]'
  const isQRCodePage = pathname === '/qr-code/edit/[id]'
  const isDailyReadingsPage = pathname === '/daily-readings/edit/[id]'
  const routeName = isAttractionsEventsPage
    ? 'attractions-events'
    : isQRCodePage
    ? 'qr-code'
    : isDailyReadingsPage
    ? 'daily-readings'
    : 'posts'

  const [
    updatePost,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_POST_MUTATION, {
    onError: _e => {}
  })

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
      selectedStatus === 'draft'
        ? validationSchemaDraft
        : isDailyReadingsPage
        ? validationSchemaDailyReadings
        : validationSchema
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
      errorHandler(errorPost)
    } else if (!loadingPost && dataPost) {
      const itemData = dataPost?.getAllPost?.post[0]

      if (itemData) {
        setPost(itemData)
        setValue('title', itemData?.title)
        setValue('content', itemData?.content)
        setValue('category', itemData?.category?._id)
        setValue(
          'images',
          itemData?.primaryMedia?.map(item => {
            return item.url
          }) ?? []
        )
        setValue(
          'video',
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            null
        )
        setTextCount(itemData?.title?.length)
        setImageUploadedData(
          itemData?.primaryMedia?.map(item => {
            return { url: item.url, type: item.type }
          }) ?? []
        )
        setSelectedCategory(itemData?.category?._id)
        setVideoUrl(
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            ''
        )
        setImageUrls(itemData?.primaryMedia?.map(item => item.url) ?? [])
        setSelectedAudienceType(itemData?.audienceType)
        setSelectedCompanyExcept(
          itemData?.audienceExceptions?.company?.length > 0
            ? itemData?.audienceExceptions?.company.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedCompanySpecific(
          itemData?.audienceExpanse?.company?.length > 0
            ? itemData?.audienceExpanse?.company.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedComplexExcept(
          itemData?.audienceExceptions?.complex?.length > 0
            ? itemData?.audienceExceptions?.complex.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedComplexSpecific(
          itemData?.audienceExpanse?.complex?.length > 0
            ? itemData?.audienceExpanse?.complex.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedBuildingExcept(
          itemData?.audienceExceptions?.building?.length > 0
            ? itemData?.audienceExceptions?.building.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedBuildingSpecific(
          itemData?.audienceExpanse?.building?.length > 0
            ? itemData?.audienceExpanse?.building.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedPublishTimeType(
          moment().isAfter(moment(new Date(itemData?.publishedAt)))
            ? 'now'
            : 'later'
        )
        setSelectedPublishDateTime(itemData?.publishedAt)
        setSelectedDate(itemData?.dailyReadingDate)
      }
    }
  }, [loadingPost, dataPost, errorPost, setValue])

  useEffect(() => {
    if (!loadingUpdate) {
      if (errorUpdate) {
        errorHandler(errorUpdate)
      }
      if (calledUpdate && dataUpdate) {
        showToast('success', 'You have successfully updated a post.')

        if (modalType === 'preview') {
          goToPreviewPage()
        } else {
          goToBulletinPageLists()
        }
      }
    }
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate, reset])

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

  const goToBulletinPageLists = () => {
    push(`/${routeName}/`)
  }

  const goToPreviewPage = () => {
    push(`/${routeName}/view/${query.id}`)
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
          setModalTitle('Move to Trash')
          setModalContent(
            <UpdateCard type="trashed" title={selected[0].title} />
          )
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
        case 'preview': {
          setModalTitle('Save & Preview Post')
          setModalContent(
            <UpdateCard type="preview-edit" title={selected[0].title} />
          )
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
        case 'unpublished': {
          setModalTitle('Unpublish Post')
          setModalContent(
            <UpdateCard type="unpublished" title={selected[0].title} />
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
      const updateData = {
        id: query.id,
        data: {
          categoryId: data.category,
          title: data?.title || 'Untitled',
          content: data?.content,
          audienceType: selectedAudienceType,
          primaryMedia:
            imageUploadedData?.length > 0 ? imageUploadedData : null,
          embeddedMediaFiles: videoUrl
            ? [
                {
                  url: videoUrl
                }
              ]
            : null
        }
      }

      if (status) {
        updateData.data.status = status
      }

      if (selectedPublishDateTime) {
        updateData.data.publishedAt = selectedPublishDateTime
      }
      if (selectedCompanySpecific) {
        if (selectedCompanySpecific[0]?.value) {
          updateData.data.audienceExpanse = {
            companyIds: selectedCompanySpecific.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            companyIds: selectedCompanySpecific
          }
        }
      }
      if (selectedCompanyExcept) {
        if (selectedCompanyExcept[0]?.value) {
          updateData.data.audienceExpanse = {
            companyIds: selectedCompanyExcept.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            companyIds: selectedCompanyExcept
          }
        }
      }
      if (selectedComplexSpecific) {
        if (selectedComplexSpecific[0]?.value) {
          updateData.data.audienceExpanse = {
            complexIds: selectedComplexSpecific.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            complexIds: selectedComplexSpecific
          }
        }
      }
      if (selectedComplexExcept) {
        if (selectedComplexExcept[0]?.value) {
          updateData.data.audienceExpanse = {
            complexIds: selectedComplexExcept.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            complexIds: selectedComplexExcept
          }
        }
      }
      if (selectedBuildingSpecific) {
        if (selectedBuildingSpecific[0]?.value) {
          updateData.data.audienceExpanse = {
            complexIds: selectedBuildingSpecific.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            complexIds: selectedBuildingSpecific
          }
        }
      }
      if (selectedBuildingExcept) {
        if (selectedBuildingExcept[0]?.value) {
          updateData.data.audienceExpanse = {
            complexIds: selectedBuildingExcept.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            complexIds: selectedBuildingExcept
          }
        }
      }

      if (isDailyReadingsPage) {
        updateData.data.dailyReadingDate = DATE.toFriendlyISO(
          DATE.setInitialTime(selectedDate)
        )
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
    setSelectedAudienceType(post?.audienceType)
    setSelectedCompanyExcept(
      post?.audienceExceptions?.company?.length > 0
        ? post?.audienceExceptions?.company.map(item => {
            return {
              value: item._id,
              label: item.name
            }
          })
        : null
    )
    setSelectedCompanySpecific(
      post?.audienceExpanse?.company?.length > 0
        ? post?.audienceExpanse?.company.map(item => {
            return {
              value: item._id,
              label: item.name
            }
          })
        : null
    )
    setSelectedComplexExcept(
      post?.audienceExceptions?.complex?.length > 0
        ? post?.audienceExceptions?.complex.map(item => {
            return {
              value: item._id,
              label: item.name
            }
          })
        : null
    )
    setSelectedComplexSpecific(
      post?.audienceExpanse?.complex?.length > 0
        ? post?.audienceExpanse?.complex.map(item => {
            return {
              value: item._id,
              label: item.name
            }
          })
        : null
    )
    setSelectedBuildingExcept(
      post?.audienceExceptions?.building?.length > 0
        ? post?.audienceExceptions?.building.map(item => {
            return {
              value: item._id,
              label: item.name
            }
          })
        : null
    )
    setSelectedBuildingSpecific(
      post?.audienceExpanse?.building?.length > 0
        ? post?.audienceExpanse?.building.map(item => {
            return {
              value: item._id,
              label: item.name
            }
          })
        : null
    )
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
    const publishType = moment().isAfter(moment(new Date(post.publishedAt)))
      ? 'now'
      : 'later'
    setSelectedPublishDateTime(post.publishedAt)
    setSelectedPublishTimeType(publishType)
    handleShowPublishTimeModal()
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
    onSubmit(getValues())
  }

  const onUnpublishPost = async () => {
    const updateData = {
      id: modalID,
      data: {
        status: 'unpublished'
      }
    }

    try {
      await updatePost({ variables: updateData })
    } catch (e) {
      console.log(e)
    }
  }

  const downloadQR = () => {
    const imageOptions = {
      scale: 5,
      encoderOptions: 1,
      backgroundColor: 'white'
    }

    saveSvgAsPng.saveSvgAsPng(
      document.querySelector('.qrCode > svg'),
      'qr.png',
      imageOptions
    )
  }

  const handleDateChange = e => {
    setSelectedDate(e)
  }

  return (
    <>
      {loadingUpdate && <PageLoader fullPage />}
      <div className={style.CreatePostContainer}>
        <h1 className={style.CreatePostHeader}>Edit a Post</h1>
        <form>
          {isQRCodePage && (
            <Card
              header={<span className={style.CardHeader}>QR Code</span>}
              content={
                <div className={style.CreateContentContainer}>
                  <div className={style.CreatePostVideoInput}>Article URL</div>
                  <FormInput
                    type="text"
                    name="qr-input"
                    value={`${window.location.origin}/${routeName}/view/${dataPost?.getAllPost?.post[0]._id}`}
                    readOnly
                  />
                  <div className={style.CreatePostVideoInput}>QR Code</div>
                  <div className="qrCode">
                    <QRCode
                      size={168}
                      value={`${window.location.origin}/${routeName}/view/${dataPost?.getAllPost?.post[0]._id}`}
                    />
                    <Button
                      default
                      label="Download"
                      onClick={downloadQR}
                      leftIcon={<FiDownload />}
                      className="mt-4"
                    />
                  </div>
                </div>
              }
            />
          )}

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
                      <strong>
                        {post?.status === 'published'
                          ? 'Published'
                          : post?.status === 'unpublished'
                          ? 'Unpublished'
                          : post?.status === 'draft'
                          ? 'Draft'
                          : 'New'}
                      </strong>
                    </span>
                    <span className="flex flex-col">
                      <div>
                        <span className={style.CreatePostSection}>
                          Audience:{' '}
                        </span>
                        <strong>
                          {selectedAudienceType === 'allExcept'
                            ? ' All those registered except:'
                            : selectedAudienceType === 'specific'
                            ? ' Only show to those selected:'
                            : ' All those registered'}
                        </strong>
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
                              {selectedCompanyExcept &&
                                selectedAudienceType === 'allExcept' && (
                                  <div>{`Companies (${selectedCompanyExcept?.length}) `}</div>
                                )}
                              {selectedCompanySpecific &&
                                selectedAudienceType === 'specific' && (
                                  <div>{`Companies (${selectedCompanySpecific?.length}) `}</div>
                                )}
                              {selectedComplexExcept &&
                                selectedAudienceType === 'allExcept' && (
                                  <div>{`Complexes (${selectedComplexExcept?.length}) `}</div>
                                )}
                              {selectedComplexSpecific &&
                                selectedAudienceType === 'specific' && (
                                  <div>{`Complexes (${selectedComplexSpecific?.length}) `}</div>
                                )}
                              {selectedBuildingExcept &&
                                selectedAudienceType === 'allExcept' && (
                                  <div>{`Buildings (${selectedBuildingExcept?.length}) `}</div>
                                )}
                              {selectedBuildingSpecific &&
                                selectedAudienceType === 'specific' && (
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
                    <strong>
                      {selectedPublishTimeType === 'later'
                        ? ` Scheduled, ${moment(selectedPublishDateTime).format(
                            'MMM DD, YYYY - hh:mm A'
                          )} `
                        : ' Immediately'}
                    </strong>
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
            <span>
              <Can
                perform="bulletin:delete"
                yes={
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
                }
                no={
                  <Button
                    default
                    disabled
                    type="button"
                    label="Move to Trash"
                    className={style.CreatePostFooterButton}
                  />
                }
              />

              {post?.status === 'draft' && (
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
                      default
                      disabled
                      type="button"
                      label="Save as Draft"
                      className={style.CreatePostFooterButton}
                    />
                  }
                />
              )}
              {post?.status === 'published' && (
                <Can
                  perform="bulletin:unpublish"
                  yes={
                    <Button
                      default
                      type="button"
                      label="Unpublish Post"
                      className={style.CreatePostFooterButton}
                      onMouseDown={() => onUpdateStatus('unpublished')}
                      onClick={handleSubmit(e => {
                        handleShowModal('unpublished')
                      })}
                    />
                  }
                  no={
                    <Button
                      default
                      disabled
                      type="button"
                      label="Unpublish Post"
                      className={style.CreatePostFooterButton}
                    />
                  }
                />
              )}
            </span>

            <span>
              <Button
                default
                type="button"
                label="Save & Preview"
                className={style.CreatePostFooterButton}
                onMouseDown={() => onUpdateStatus('draft')}
                onClick={handleSubmit(e => {
                  handleShowModal('preview')
                })}
              />
              <Button
                type="button"
                label="Update Post"
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
              : modalType === 'unpublished'
              ? onUnpublishPost()
              : null
          }
          onCancel={() => setShowModal(old => !old)}
        >
          <div className="w-full">{modalContent}</div>
        </Modal>
      </div>
    </>
  )
}

export default CreatePosts
