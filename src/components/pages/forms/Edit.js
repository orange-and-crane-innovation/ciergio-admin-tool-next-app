/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation, useQuery } from '@apollo/client'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import Uploader from '@app/components/uploader'
import Modal from '@app/components/modal'
import PageLoader from '@app/components/page-loader'

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
  content: yup.string().label('Content').nullable(),
  embeddedFiles: yup.array().label('Image').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65),
  content: yup.mixed().nullable()
})

const CreatePosts = () => {
  const { query, push } = useRouter()
  const [loading, setLoading] = useState(false)
  const [maxFiles] = useState(3)
  const [post, setPost] = useState([])
  const [fileUrls, setFileUrls] = useState([])
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [videoUrl, setVideoUrl] = useState()
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
  const [isEdit, setIsEdit] = useState(true)
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType

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

  const { handleSubmit, control, reset, errors, register, setValue } = useForm({
    resolver: yupResolver(
      selectedStatus === 'draft' ? validationSchemaDraft : validationSchema
    ),
    defaultValues: {
      title: '',
      content: null,
      video: '',
      embeddedFiles: null
    }
  })

  register({ name: 'embeddedFiles' })

  useEffect(() => {
    if (errorPost) {
      errorHandler(errorPost)
    } else if (!loadingPost && dataPost) {
      const itemData = dataPost?.getAllPost?.post[0]

      if (itemData) {
        setPost(itemData)
        setValue('title', itemData?.title)
        setValue('content', itemData?.content)
        setValue(
          'embeddedFiles',
          itemData?.primaryMedia?.map(item => {
            return item.url
          })
        )
        setValue(
          'video',
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            null
        )
        setTextCount(itemData?.title?.length)
        setFileUploadedData(
          itemData?.primaryMedia.map(item => {
            return { url: item.url, type: item.type }
          })
        )
        setVideoUrl(
          (itemData?.embeddedMediaFiles &&
            itemData?.embeddedMediaFiles[0]?.url) ??
            ''
        )
        setFileUrls(itemData?.primaryMedia.map(item => item.url))
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
        reset()
        resetForm()

        switch (modalType) {
          case 'unpublished':
            message = `You have successfully unpublished a form.`
            break
          case 'delete':
            message = `You have successfully sent a form to the trash.`
            break
          default:
            message = `You have successfully updated a form.`
            break
        }

        showToast('success', message)
        goToFormsPageLists()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const goToFormsPageLists = () => {
    push('/forms/')
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
        fileUrls,
        response.data.map(item => item.location)
      )
      const combinedUploadedImages = [].concat(fileUploadedData, imageData)

      setFileUrls(combinedImages)
      setFileUploadedData(combinedUploadedImages)
    }
  }

  const onUploadFile = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length > maxFiles) {
        showToast('info', `Maximum of ${maxFiles} files only`)
      } else {
        setLoading(true)
        for (const file of files) {
          const reader = new FileReader()

          reader.onloadend = () => {
            setFileUploadedData(prevArr => [...prevArr, file])
            setLoading(false)
          }
          reader.readAsDataURL(file)

          formData.append('photos', file)
          fileList.push(file)
        }
        setValue('embeddedFiles', fileList)

        uploadApi(formData)
      }
    }
  }

  const onRemoveFile = e => {
    const files = fileUrls.filter(item => {
      return item !== e.currentTarget.dataset.id
    })
    const uploadedFiles = fileUploadedData.filter(image => {
      return image.url !== e.currentTarget.dataset.id
    })
    setFileUrls(files)
    setFileUploadedData(uploadedFiles)
    setValue('embeddedFiles', files.length !== 0 ? files : null)
  }

  const onSubmit = (data, status) => {
    if (
      data?.embeddedFiles === null &&
      data?.title === '' &&
      data?.content === null
    ) {
      showToast('info', `Ooops, it seems like there's no data to be saved.`)
    } else {
      const updateData = {
        id: query.id,
        data: {
          title: data?.title || 'Untitled',
          content: data?.content,
          audienceType: selectedAudienceType,
          status: status,
          primaryMedia: fileUploadedData,
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
        if (selectedCompanySpecific[0]?.value) {
          updateData.data.audienceExpanse = {
            companyIds: selectedCompanySpecific.map(item => item.value)
          }
        } else {
          updateData.data.audienceExpanse = {
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
          updateData.data.audienceExpanse = {
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
            buildingIds: selectedBuildingSpecific.map(item => item.value)
          }
        } else {
          updateData.data.audienceExpanse = {
            buildingIds: selectedBuildingSpecific
          }
        }
      }
      if (selectedBuildingExcept) {
        if (selectedBuildingExcept[0]?.value) {
          updateData.data.audienceExpanse = {
            buildingIds: selectedBuildingExcept.map(item => item.value)
          }
        } else {
          updateData.data.audienceExceptions = {
            buildingIds: selectedBuildingExcept
          }
        }
      }
      updatePost({ variables: updateData })
    }
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
    setSelectedPublishDateTime(new Date())
    setSelectedPublishTimeType('now')
    handleShowPublishTimeModal()
  }

  const resetForm = () => {
    setLoading(false)
    setFileUrls([])
    setFileUploadedData([])
    setTextCount(0)
    setShowAudienceModal(false)
    setShowPublishTimeModal(false)
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

  return (
    <>
      {loadingUpdate && <PageLoader fullPage />}
      <div className={style.CreatePostContainer}>
        <h1 className={style.CreatePostHeader}>Edit Form</h1>
        <form>
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
            header={<span className={style.CardHeader}>Files</span>}
            content={
              <div className={style.CreateContentContainer}>
                <p>You may upload PDFs or DOCs with max file size of 1.5MB.</p>
                <p>Maximum of 3 files only.</p>
                <br />
                <Uploader
                  multiple
                  files={fileUploadedData}
                  fileUrls={fileUrls}
                  loading={loading}
                  error={errors?.embeddedFiles?.message ?? null}
                  maxFiles={maxFiles}
                  accept=".pdf, .doc, .docx"
                  onUpload={onUploadFile}
                  onRemove={onRemoveFile}
                />
              </div>
            }
          />

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
                            ? ' All those registered except: '
                            : selectedAudienceType === 'specific'
                            ? ' Only show to those selected: '
                            : ' All those registered '}
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
                            <span
                              className={style.CreatePostLink}
                              onClick={handleShowAudienceModal}
                            >
                              Edit
                            </span>
                          </span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          <div className={style.CreatePostFooter}>
            <span>
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
              {post?.status === 'draft' && (
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
              )}
              {post?.status === 'published' && (
                <Button
                  default
                  type="button"
                  label="Unpublish Form"
                  className={style.CreatePostFooterButton}
                  onMouseDown={() => onUpdateStatus('unpublished')}
                  onClick={handleSubmit(e => {
                    handleShowModal('unpublished')
                  })}
                />
              )}
            </span>

            <Button
              type="button"
              label="Publish Form"
              primary
              onMouseDown={() => onUpdateStatus('active')}
              onClick={handleSubmit(e => {
                onSubmit(e, 'active')
              })}
            />
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
          onOk={() =>
            modalType === 'delete'
              ? onDeletePost()
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
