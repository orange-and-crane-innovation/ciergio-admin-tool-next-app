/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import * as yup from 'yup'

import { Controller, useForm } from 'react-hook-form'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { FiDownload, FiFilm, FiVideo } from 'react-icons/fi'
import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

import { ACCOUNT_TYPES } from '@app/constants'
import AudienceModal from './components/AudienceModal'
import Button from '@app/components/button'
import Can from '@app/permissions/can'
import Card from '@app/components/card'
import { DATE } from '@app/utils'
import Datetime from 'react-datetime'
import FileUpload from '@app/components/uploader/simple'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Modal from '@app/components/modal'
import OfferingsCard from './components/OfferingsCard'
import PageLoader from '@app/components/page-loader'
import ProgressBar from '@app/components/progress-bar'
import PublishTimeModal from './components/PublishTimeModal'
import QRCode from 'react-qr-code'
import SelectCategory from '@app/components/globals/SelectCategory'
import Toggle from '@app/components/toggle'
import UpdateCard from './components/UpdateCard'
import Uploader from '@app/components/uploader'
import UploaderImage from '@app/components/uploader/image'
import VideoPlayer from '@app/components/globals/VideoPlayer'
import axios from 'axios'
import dayjs from 'dayjs'
import showToast from '@app/utils/toast'
import style from './Create.module.css'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'

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
        hideCreatedAt
        showMetadata
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
        attachments {
          url
          type
        }
        embeddedMediaFiles {
          url
          platform
          type
        }
        audienceType
        audienceExpanse {
          company {
            _id
            name
          }
          complex {
            _id
            name
          }
          building {
            _id
            name
          }
          companyGroups {
            _id
            name
          }
        }
        audienceExceptions {
          company {
            _id
            name
          }
          complex {
            _id
            name
          }
          building {
            _id
            name
          }
          companyGroups {
            _id
            name
          }
        }
      }
    }
  }
`

const GET_POST_PRAY_QUERY = gql`
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
        hideCreatedAt
        showMetadata
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
        attachments {
          url
          type
        }
        embeddedMediaFiles {
          url
          platform
          type
        }
        audienceType
        audienceExpanse {
          company {
            _id
            name
          }
          complex {
            _id
            name
          }
          building {
            _id
            name
          }
          companyGroups {
            _id
            name
          }
        }
        audienceExceptions {
          company {
            _id
            name
          }
          complex {
            _id
            name
          }
          building {
            _id
            name
          }
          companyGroups {
            _id
            name
          }
        }
        dailyReadingDate
        offering
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
  attachments: yup.array().label('Attachments').nullable(),
  category: yup.string().label('Category').nullable().required(),
  embeddedVideo: yup.array().label('File').nullable()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 120 characters only', val => val.length <= 120),
  content: yup.string().nullable(),
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
  content: yup.string().label('Content').nullable().required(),
  images: yup.array().label('Image').nullable(),
  attachments: yup.array().label('Attachments').nullable(),
  embeddedVideo: yup.string().nullable()
})

const CreatePosts = () => {
  const { query, push, pathname } = useRouter()
  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [fileFormData, setFileFormData] = useState(false)
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [maxImages] = useState(10)
  const [maxAttachments] = useState(20)
  const [uploadedAttachment, setUploadedAttachment] = useState([])
  const [urlsAttachment, setUrlsAttachment] = useState([])
  const [uploadErrorAttachment, setUploadErrorAttachment] = useState()
  const [maxFiles] = useState(1)
  const [fileMaxSizeAttachment] = useState(10485760) // 10MB
  const [fileMaxSize] = useState(104857600) // 100MB
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fileUrls, setFileUrls] = useState([])
  const [imageUploadError, setImageUploadError] = useState()
  const [fileUploadError, setFileUploadError] = useState()
  const [videoUrl, setVideoUrl] = useState()
  const [videoLocalUrl, setVideoLocalUrl] = useState()
  const [videoError, setVideoError] = useState()
  const [localVideoError, setLocalVideoError] = useState()
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
  const [errorSelectedDate, setErrorSelectedDate] = useState()
  const [toggleOfferings, setToggleOfferings] = useState()
  const [toggleCreateDate, setToggleCreateDate] = useState()
  const [toggleMetaData, setToggleMetaData] = useState()
  const [isEdit, setIsEdit] = useState(true)
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = systemType === 'pray'
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const isAttractionsEventsPage = pathname === '/attractions-events/edit/[id]'
  const isQRCodePage = pathname === '/qr-code/edit/[id]'
  const [selectedGroupSpecific, setSelectedGroupSpecific] = useState()
  const [selectedGroupExcept, setSelectedGroupExcept] = useState()

  const isDailyReadingsPage = pathname === '/daily-readings/edit/[id]'
  const isBulletinPostsPage = pathname === '/posts/edit/[id]'
  const isPastoralWorksPage = pathname === '/pastoral-works/edit/[id]'

  const AttachmentUploader = Uploader

  const typeOfPage = (
    dailyText = 'daily_reading',
    bulletinText = 'post',
    pastoralText = 'pastoral_works'
  ) => {
    return (
      (isDailyReadingsPage && dailyText) ||
      (isBulletinPostsPage && bulletinText) ||
      (isPastoralWorksPage && pastoralText)
    )
  }

  const routeName = isAttractionsEventsPage
    ? 'attractions-events'
    : isQRCodePage
    ? 'qr-code'
    : typeOfPage('daily-readings', 'posts', 'pastoral-works')

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

  const {
    loading: loadingPost,
    data: dataPost,
    error: errorPost,
    refetch
  } = useQuery(isSystemPray ? GET_POST_PRAY_QUERY : GET_POST_QUERY, {
    variables: {
      where: {
        _id: query.id
      }
    }
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
      title: '',
      content: null,
      video: '',
      category: null,
      images: null,
      attachments: null,
      embeddedVideo: null
    }
  })

  register({ name: 'images' })
  register({ name: 'attachments' })
  register({ name: 'embeddedVideo' })

  useEffect(() => {
    refetch()
  }, [])

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
          'attachments',
          itemData?.attachments?.map(item => {
            return item.url
          }) ?? []
        )
        setValue(
          'video',
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.platform &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            null
        )
        setTextCount(itemData?.title?.length)
        setImageUploadedData(
          itemData?.primaryMedia?.map(item => {
            return { url: item.url, type: item.type }
          }) ?? []
        )
        setUploadedAttachment(
          itemData?.attachments?.map(item => {
            return { url: item.url, type: item.type }
          }) ?? []
        )
        setSelectedCategory(itemData?.category?._id)
        setVideoUrl(
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.platform &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            ''
        )
        setImageUrls(itemData?.primaryMedia?.map(item => item.url) ?? [])
        setUrlsAttachment(itemData?.attachments?.map(item => item.url) ?? [])
        setFileUrls(
          itemData?.embeddedMediaFiles &&
            !itemData?.embeddedMediaFiles[0]?.platform
            ? itemData?.embeddedMediaFiles?.map(item => item.url)
            : []
        )
        setFileUploadedData(
          itemData?.embeddedMediaFiles &&
            !itemData?.embeddedMediaFiles[0]?.platform
            ? itemData?.embeddedMediaFiles?.map(item => {
                return { url: item.url }
              })
            : []
        )
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
        setSelectedGroupExcept(
          itemData?.audienceExceptions?.companyGroups?.length > 0
            ? itemData?.audienceExceptions?.companyGroups.map(item => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            : null
        )
        setSelectedGroupSpecific(
          itemData?.audienceExpanse?.companyGroups?.length > 0
            ? itemData?.audienceExpanse?.companyGroups.map(item => {
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
          dayjs().isAfter(dayjs(new Date(itemData?.publishedAt)))
            ? 'now'
            : 'later'
        )
        setSelectedPublishDateTime(new Date(itemData?.publishedAt))
        setSelectedDate(itemData?.dailyReadingDate)
        setToggleOfferings(itemData?.offering)
        setToggleCreateDate(itemData?.hideCreatedAt)
        setToggleMetaData(itemData?.showMetadata)
      }
    }
  }, [loadingPost, dataPost, errorPost, setValue])

  useEffect(() => {
    if (!loadingUpdate) {
      if (errorUpdate) {
        errorHandler(errorUpdate)
      }
      if (calledUpdate && dataUpdate) {
        let message

        switch (modalType) {
          case 'unpublished':
            message = 'You have successfully unpublished a post.'
            break
          case 'delete':
            message = 'You have successfully sent an item to the trash.'
            break
          default:
            message = 'You have successfully updated a post.'
            break
        }

        if (showModal) {
          handleShowModal()
        }
        showToast('success', message)

        if (modalType === 'preview') {
          goToPreviewPage()
          refetch()
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
    window.open(`/${routeName}/view/${query.id}`, '_blank')
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
        case 'remove-video': {
          setModalTitle('Remove Video')
          setModalContent(<UpdateCard type="remove-video" />)
          setModalFooter(true)
          setModalID(null)
          break
        }
      }
      setShowModal(old => !old)
    }
  }

  const handleClearModal = () => {
    handleShowModal()
  }

  const uploadApi = async ({ payload, type }) => {
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
          if (type === 'attachments') {
            response.data.map(item => {
              setUrlsAttachment(prevArr => [...prevArr, item.location])
              return setUploadedAttachment(prevArr => [
                ...prevArr,
                {
                  url: item.location,
                  type: item.mimetype
                }
              ])
            })
            setUploadErrorAttachment(null)
          } else {
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
        }
      })
      .catch(function (error) {
        if (type === 'attachments') {
          const errMsg = 'Failed to upload the attachment. Please try again.'
          console.log(error)
          showToast('danger', errMsg)
          setUploadErrorAttachment(errMsg)
          setValue('attachments', null)
        } else {
          const errMsg = 'Failed to upload image. Please try again.'
          console.log(error)
          showToast('danger', errMsg)
          setImageUploadError(errMsg)
          setValue('images', null)
        }
      })
      .then(() => {
        setLoading(false)
      })
  }

  const onInitUpload = ({ e, type }) => {
    console.log('onInitUpload ', type, e)
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      let maxSize = 0
      for (const file of files) {
        if (file.size > fileMaxSizeAttachment) {
          maxSize++
        }
      }
      if (type === 'attachments') {
        if (files.length + urlsAttachment?.length > maxAttachments) {
          showToast('info', `Maximum of ${maxAttachments} files only`)
        } else if (maxSize > 0) {
          showToast(
            'info',
            `Maximum size of ${fileMaxSizeAttachment / 1024 / 1024}mb only`
          )
        } else {
          setLoading(true)
          setUploadErrorAttachment(null)

          if (errors?.attachements?.message) {
            errors.attachements.message = null
          }

          for (const file of files) {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            formData.append('files', file)
            fileList.push(file)
          }
          setValue('attachements', fileList)

          uploadApi({
            payload: formData,
            type
          })
        }
      } else {
        if (files.length + imageUrls?.length > maxImages) {
          showToast('info', `Maximum of ${maxImages} files only`)
        } else if (maxSize > 0) {
          showToast(
            'info',
            `Maximum size of ${fileMaxSizeAttachment / 1024 / 1024}mb only`
          )
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

          uploadApi({
            payload: formData,
            type
          })
        }
      }
    }
  }

  const onRemoveUploadedItem = ({ e, type }) => {
    if (type === 'attachments') {
      const ab = imageUrls.filter(b => {
        return b !== e.currentTarget.dataset.id
      })
      const cd = uploadedAttachment.filter(d => {
        return d.url !== e.currentTarget.dataset.id
      })
      setUrlsAttachment(ab)
      setUploadedAttachment(cd)
      setValue('attachments', ab.length !== 0 ? ab : null)
    } else {
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
  }

  const onVideoChange = e => {
    setVideoLoading(e.target.value !== '')
    setVideoError(null)
    setVideoUrl(e.target.value)
    setVideoLocalUrl(null)
    setSelectedFiles([])
    setFileUrls([])
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

  const onLocalVideoError = () => {
    setVideoLoading(false)
    setLocalVideoError('Invalid video / format not supported')
  }

  const onLocalVideoReady = () => {
    setVideoLoading(false)
    setLocalVideoError(null)
  }

  const onAddFile = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    onRemoveFile()

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
          reader.onloadend = () => {
            setVideoLocalUrl(reader.result)
          }
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

  const onRemoveFile = () => {
    setSelectedFiles([])
    setFileUrls([])
    setFileUploadedData([])
    setValue('embeddedVideo', null)
    setValue('video', null)
    setVideoUrl(null)
    setVideoLocalUrl(null)
    setLocalVideoError(null)

    if (showModal) {
      handleClearModal()
    }
  }

  const onUploadFile = () => {
    setFileLoading(true)
    setFileUploadError(null)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyID
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
          setVideoLocalUrl(null)
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
      const updateData = {
        id: query.id,
        data: {
          categoryId: data.category,
          title: data?.title || 'Untitled',
          content:
            data?.content === ''
              ? null
              : data?.content?.replace(/(&nbsp;)+/g, ''),
          audienceType: selectedAudienceType,
          primaryMedia:
            imageUploadedData?.length > 0 ? imageUploadedData : null,
          attachments:
            uploadedAttachment?.length > 0 ? uploadedAttachment : null,
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
      }

      if (status) {
        updateData.data.status =
          !dayjs().isAfter(dayjs(new Date(selectedPublishDateTime))) &&
          status !== 'draft' &&
          selectedPublishTimeType === 'later'
            ? 'scheduled'
            : status
      }

      if (selectedPublishDateTime) {
        updateData.data.publishedAt =
          selectedPublishTimeType === 'now'
            ? new Date()
            : selectedPublishDateTime
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
      if (selectedGroupSpecific) {
        updateData.data.audienceExpanse = {
          companyGroupIds: selectedGroupSpecific.map(item => item.value)
        }
      }
      if (selectedGroupExcept) {
        updateData.data.audienceExceptions = {
          companyGroupIds: selectedGroupExcept.map(item => item.value)
        }
      }
      if (isDailyReadingsPage) {
        updateData.data.dailyReadingDate = DATE.toFriendlyISO(
          DATE.addTime(DATE.setInitialTime(selectedDate), 'hours', 8)
        )
      }
      if (isSystemPray) {
        updateData.data.offering = toggleOfferings
      }
      updateData.data.hideCreatedAt = toggleCreateDate
      updateData.data.showMetadata = toggleMetaData

      console.log('updateData', updateData)
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

  const onSelectGroupSpecific = data => {
    console.log('AUDIENCEEEEEE', data)
    setSelectedGroupSpecific(data)
  }

  const onSelectGroupExcept = data => {
    setSelectedGroupExcept(data)
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
    const publishType = dayjs().isAfter(dayjs(new Date(post.publishedAt)))
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

  const onToggleOfferings = e => {
    setToggleOfferings(e)
  }

  const onToggleCreateDate = e => {
    setToggleCreateDate(e)
  }

  const onToggleMetaData = e => {
    setToggleMetaData(e)
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
                    value={`${window.location.origin}/public-qr-posts/view/${dataPost?.getAllPost?.post[0]._id}`}
                    readOnly
                  />
                  <div className={style.CreatePostVideoInput}>QR Code</div>
                  <div className="qrCode">
                    <QRCode
                      size={168}
                      value={`${window.location.origin}/public-qr-posts/view/${dataPost?.getAllPost?.post[0]._id}`}
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
                  error={errors?.images?.message ?? imageUploadError ?? null}
                  onUploadImage={e => {
                    onInitUpload({
                      e: e,
                      type: 'feature'
                    })
                  }}
                  onRemoveImage={e => {
                    onRemoveUploadedItem({
                      e: e,
                      type: 'feature'
                    })
                  }}
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
                                      defaultValue={dayjs(selectedDate).format(
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
                  {typeOfPage(
                    'Daily Reading Title',
                    'Title',
                    'Pastoral Work Title'
                  )}
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

          {/* Attachment */}
          <Card
            header={
              <span className={style.CardHeader}>Attachments (optional)</span>
            }
            content={
              <div className={style.CreateContentContainer}>
                <p>
                  You may upload PDFs, DOCs, DOCXs or Images with max file size
                  of {(fileMaxSize / 1024 / 1024).toFixed(1)}MB. Maximum of{' '}
                  {maxAttachments} files only.
                </p>
                <br />
                <AttachmentUploader
                  name="attachment"
                  multiple
                  files={uploadedAttachment}
                  fileUrls={urlsAttachment}
                  loading={loading}
                  error={
                    errors?.attachments?.message ??
                    uploadErrorAttachment ??
                    null
                  }
                  maxFiles={maxAttachments}
                  accept=".pdf, .doc, .docx, .png, .jpg, .jpeg"
                  onUpload={e => {
                    onInitUpload({
                      e: e,
                      type: 'attachments'
                    })
                  }}
                  onRemove={e => {
                    onRemoveUploadedItem({
                      e: e,
                      type: 'attachments'
                    })
                  }}
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
                    <div className={style.CreatePostVideoContent}>
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

                      {!videoUrl && (
                        <div className="flex items-start">
                          <FiFilm className={style.CreateVideoIcon} />
                          <div>
                            <div className={style.CreatePostVideoInput}>
                              <div>or select a video from your computer:</div>
                              <div className="text-neutral-600 font-normal">
                                MP4 is only accepted.
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
                                      accept=".mp4"
                                      maxSize={fileMaxSize}
                                      files={selectedFiles}
                                      error={localVideoError}
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

                <div className="w-full md:max-w-lg">
                  {videoLocalUrl && !localVideoError && (
                    <VideoPlayer
                      url={videoLocalUrl}
                      onError={onLocalVideoError}
                      onReady={onLocalVideoReady}
                    />
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
                        onClick={() => handleShowModal('remove-video')}
                      />
                    </>
                  )}
                </div>
              </div>
            }
            footer={
              selectedFiles?.length > 0 &&
              fileUrls?.length === 0 &&
              !localVideoError && (
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

          {isSystemPray && (
            <Card
              header={<span className={style.CardHeader}>Offerings</span>}
              content={
                <div className={style.CreateContentContainer}>
                  <div className={style.CreatePostOfferingsContent}>
                    <Toggle
                      onChange={onToggleOfferings}
                      defaultChecked={toggleOfferings}
                      toggle={toggleOfferings}
                    />
                    <div className={style.CreatePostOfferingsSubContent}>
                      <div className={style.CreatePostOfferingSubContent2}>
                        <i
                          className={`ciergio-donate-2 ${style.CreatePostOfferingsIcon}`}
                        />
                        <span>
                          <p>
                            <strong>Ask for Offerings in this Article</strong>
                          </p>
                          <p className={style.CreatePostOfferingText}>
                            A Call to Action button to make an offering will be
                            visible in the article.
                            <br />
                            The button will redirect the user to Offerings.
                          </p>
                        </span>
                      </div>
                      {toggleOfferings && <OfferingsCard />}
                    </div>
                  </div>
                </div>
              }
            />
          )}

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
                          type={typeOfPage('', 'post', 'pastoral_works')}
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

                    <span className="flex">
                      <span className={style.CreatePostSection}>Publish: </span>
                      <strong>
                        {selectedPublishTimeType === 'later'
                          ? ` Scheduled, ${dayjs(
                              selectedPublishDateTime
                            ).format('MMM DD, YYYY - hh:mm A')} `
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
                            accountType !== ACCOUNT_TYPES.COMPXAD.value)) && (
                          <span
                            className={style.CreatePostLink}
                            onClick={handleShowAudienceModal}
                          >
                            Edit
                          </span>
                        )}
                      </div>

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
                                {selectedGroupExcept && (
                                  <div>{`Groups (${selectedGroupExcept?.length}) `}</div>
                                )}
                                {selectedGroupSpecific && (
                                  <div>{`Groups (${selectedGroupSpecific?.length}) `}</div>
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
                    </span>
                  </div>

                  <div className={style.CreatePostPublishSubContent}>
                    <span className="flex">
                      <span className={style.CreatePostSection}>
                        Hide created date: &nbsp;{' '}
                      </span>
                      <span className="mr-2">
                        <Toggle
                          onChange={onToggleCreateDate}
                          defaultChecked={toggleCreateDate}
                          toggle={toggleCreateDate}
                        />
                      </span>
                    </span>

                    <span className="flex">
                      <span className={style.CreatePostSection}>
                        Show meta data: &nbsp;{' '}
                      </span>
                      <span className="mr-2">
                        <Toggle
                          onChange={onToggleMetaData}
                          defaultChecked={toggleMetaData}
                          toggle={toggleMetaData}
                        />
                      </span>
                    </span>
                  </div>
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
                    loading={loading || fileLoading}
                    disabled={loading || fileLoading}
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
                      loading={loading || fileLoading}
                      disabled={loading || fileLoading}
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
                      loading={loading || fileLoading}
                      disabled={loading || fileLoading}
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
                loading={loading || fileLoading}
                disabled={loading || fileLoading}
              />

              <Button
                type="button"
                label={
                  post?.status === 'draft'
                    ? 'Publish'
                    : typeOfPage(
                        'Update Daily Reading',
                        'Update Post',
                        'Update Pastoral Work'
                      )
                }
                primary
                onMouseDown={() => onUpdateStatus('active')}
                onClick={handleSubmit(e => {
                  onSubmit(e, 'active')
                })}
                loading={loading || fileLoading}
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
          onSelectGroupSpecific={onSelectGroupSpecific}
          onSelectGroupExcept={onSelectGroupExcept}
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
          valueGroupExcept={selectedGroupExcept}
          valueGroupSpecific={selectedGroupSpecific}
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
            modalType === 'delete'
              ? 'Yes, move to trash'
              : modalType === 'preview'
              ? 'Save & Continue'
              : modalType === 'remove-video'
              ? 'Continue'
              : 'Yes'
          }
          onOk={() =>
            modalType === 'delete'
              ? onDeletePost()
              : modalType === 'preview'
              ? onPreviewPost()
              : modalType === 'unpublished'
              ? onUnpublishPost()
              : modalType === 'remove-video'
              ? onRemoveFile()
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
