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
  embeddedFiles: yup.array().label('Image').nullable().required(),
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
  const [maxFiles] = useState(3)
  const [fileUrls, setFileUrls] = useState([])
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [videoUrl, setVideoUrl] = useState()
  const [inputMaxLength] = useState(65)
  const [textCount, setTextCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()
  const [, setModalID] = useState()
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [modalFooter, setModalFooter] = useState(null)
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const [showPublishTimeModal, setShowPublishTimeModal] = useState(false)
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
      embeddedFiles: null
    }
  })

  register({ name: 'embeddedFiles' })

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
          'embeddedFiles',
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
        goToFormsPageLists()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate, reset])

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
          setModalTitle('Delete Post')
          setModalContent(
            <UpdateCard type="trashed" title={selected[0].title} />
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
          categoryId: data.category,
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

  const onPreviewPost = () => {
    onSubmit(getValues(), 'draft')
  }

  const onDeletePost = () => {}

  return (
    <div className={style.CreatePostContainer}>
      <h1 className={style.CreatePostHeader}>Create a Post</h1>
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
          <Button
            type="button"
            label="Publish Post"
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
          modalType === 'draft'
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
