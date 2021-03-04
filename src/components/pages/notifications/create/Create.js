import React, { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery } from '@apollo/client'

import { Card } from '@app/components/globals'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'

import showToast from '@app/utils/toast'
import { CREATE_POST_MUTATION, GET_POST_CATEGORIES } from '../queries'

import AudienceModal from '../components/AudienceModal'
import PublishTimeModal from '../components/PublishTimeModal'
import PreviewModal from '../components/PreviewModal'
import AudienceType from './AudienceType'
import PublishType from './PublishType'

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .label('Title')
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65)
    .required(),
  content: yup.mixed().label('Content').nullable(),
  embeddedFiles: yup.array().label('File').nullable().required(),
  category: yup.string().label('Category').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65),
  content: yup.mixed(),
  embeddedFiles: yup.array().label('File').nullable(),
  category: yup.string().nullable()
})

function CreateNotification() {
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAudienceType, setSelectedAudienceType] = useState('all')
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()
  const [selectedPublishTimeType, setSelectedPublishTimeType] = useState()
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const [showPublishTimeModal, setShowPublishTimeModal] = useState(false)
  const [previewNotification, setPreviewNotification] = useState(false)
  const [previewData, setPreviewData] = useState({
    primaryMedia: [
      {
        url: null
      }
    ],
    title: '',
    content: ''
  })

  const { handleSubmit, control, reset, errors, register, setValue } = useForm({
    resolver: yupResolver(
      selectedStatus === 'draft' ? validationSchemaDraft : validationSchema
    ),
    defaultValues: {
      title: '',
      content: null,
      category: null,
      embeddedFiles: null
    }
  })

  register({ name: 'embeddedFiles' })

  const { data: categories } = useQuery(GET_POST_CATEGORIES)

  const [
    createPost,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_POST_MUTATION)

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        showToast('danger', 'Sorry, an error occured during creation of post.')
      }
      if (calledCreate && dataCreate) {
        reset()
        resetForm()
        showToast('success', 'You have successfully created a post.')
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate, reset])

  const uploadApi = async payload => {
    const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_API, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      const imageData = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype
        }
      })

      setFileUploadedData(imageData)
    }
  }

  const onSubmit = (data, status) => {
    if (status === 'preview') {
      setPreviewData({
        primaryMedia: fileUploadedData,
        title: data?.title,
        content: data?.content
      })
      setPreviewNotification(old => !old)
      return
    }

    if (
      data?.embeddedFiles === null &&
      data?.title === '' &&
      data?.content === null
    ) {
      showToast('info', `Ooops, it seems like there's no data to be saved.`)
    } else {
      const createData = {
        type: 'form',
        categoryId: data.category,
        title: data?.title || 'Untitled',
        content: data?.content,
        audienceType: selectedAudienceType,
        status: status,
        primaryMedia: fileUploadedData
      }
      if (selectedPublishDateTime) {
        createData.publishedAt = selectedPublishDateTime
      }
      if (selectedCompanySpecific) {
        createData.audienceExpanse = { companyIds: selectedCompanySpecific }
      }
      if (selectedCompanyExcept) {
        createData.audienceExceptions = { companyIds: selectedCompanyExcept }
      }
      createPost({ variables: { data: createData } })
    }
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length > 3) {
        showToast('info', `Maximum of 3 files only`)
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

  const resetForm = () => {
    setLoading(false)
    setImageUrls([])
    setFileUploadedData([])
    // setTextCount(0)
    setShowAudienceModal(false)
    setShowPublishTimeModal(false)
    setSelectedAudienceType('all')
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(null)
    setSelectedPublishTimeType('now')
    setSelectedPublishDateTime(null)
    setSelectedStatus('active')
  }

  const postCategories = useMemo(() => {
    if (categories?.getPostCategory.category?.length) {
      return categories.getPostCategory.category.map(category => ({
        label: category.name,
        value: category._id
      }))
    }

    return []
  }, [categories?.getPostCategory])

  return (
    <section className="content-wrap">
      <h1 className="content-title">Create a Notification</h1>
      <form>
        <div className="flex justify-between">
          <div className="w-9/12 mr-8">
            <Card
              content={
                <div className="p-4">
                  <div className="title">
                    <h1 className="pb-4 text-base text-gray-500 font-bold">
                      Title
                    </h1>
                    <Controller
                      control={control}
                      name="title"
                      render={({ name, value, onChange }) => (
                        <FormInput
                          name={name}
                          value={value}
                          onChange={onChange}
                          placeholder={`What's is the title of your notification?`}
                        />
                      )}
                    />
                  </div>
                  <div className="message mt-8">
                    <h1 className="pb-4 text-base text-gray-500 font-bold">
                      Content
                    </h1>
                    <Controller
                      control={control}
                      name="message"
                      render={({ name, value, onChange }) => (
                        <FormTextArea
                          name={name}
                          value={value}
                          onChange={onChange}
                          maxLength={500}
                          options={['history']}
                          placeholder="Write your text here"
                        />
                      )}
                    />
                  </div>
                </div>
              }
            />
            <div className="w-full mt-8">
              <Card
                title={<h1 className="font-bold text-base">Featured Image</h1>}
                content={
                  <>
                    <div className="p-4">
                      <p>
                        You may feature a single image. This image will appear
                        when viewing the notification within the app.
                      </p>
                      <div className="my-4">
                        <UploaderImage
                          name="image"
                          multiple
                          maxImages={3}
                          images={imageUrls}
                          loading={loading}
                          error={errors?.images?.message ?? null}
                          onUploadImage={onUploadImage}
                          onRemoveImage={onRemoveImage}
                        />
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            <Card
              title={<h1 className="text-base font-bold">Categories</h1>}
              content={
                <div className="p-4 w-full border-t ">
                  <div className="w-1/3 mt-4">
                    <Controller
                      control={control}
                      name="postCategory"
                      render={({ name, onChange, value }) => (
                        <FormSelect
                          name={name}
                          value={value}
                          options={postCategories}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              }
            />
            <Card
              title={<h1 className="text-base font-bold ">Publish Details</h1>}
              content={
                <div className="flex items-start w-full border-t pt-2">
                  <div className="w-1/2 mb-4 p-4 border-b">
                    <div className="mb-2">
                      <span>Status:</span>{' '}
                      <span className="font-bold ml-5">New</span>
                    </div>
                    <AudienceType
                      audienceType={selectedAudienceType}
                      specificCompanies={selectedCompanySpecific}
                      excludedCompanies={selectedCompanyExcept}
                      onShowAudienceModal={() =>
                        setShowAudienceModal(old => !old)
                      }
                    />
                  </div>
                  <div className="w-1/2 mb-4 p-4">
                    <PublishType
                      onShowPublishTypeModal={() =>
                        setShowPublishTimeModal(old => !old)
                      }
                      publishType={selectedPublishTimeType}
                      publishDateTime={selectedPublishDateTime}
                    />
                  </div>
                </div>
              }
            />
            <div className="w-full grid grid-cols-6">
              <div className="col-span-3 col-start-4 col-end-7 flex justify-end">
                <Button
                  default
                  label="Save as Draft"
                  onClick={() => {
                    handleSubmit(e => onSubmit(e, 'draft'))
                  }}
                  className="mr-4"
                />
                <Button
                  default
                  label="Preview"
                  onClick={() => {
                    handleSubmit(e => onSubmit(e, 'preview'))
                  }}
                  className=" mr-4"
                />
                <Button
                  primary
                  label="Publish"
                  onClick={() => {
                    handleSubmit(e => onSubmit(e, 'active'))
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <AudienceModal
        visible={showAudienceModal}
        onCancel={() => setShowAudienceModal(old => !old)}
        onSave={() => setShowAudienceModal(old => !old)}
        onSelectAudienceType={setSelectedAudienceType}
        onSelectCompanyExcept={setSelectedCompanyExcept}
        onSelectCompanySpecific={setSelectedCompanySpecific}
      />
      <PublishTimeModal
        visible={showPublishTimeModal}
        onCancel={() => setShowPublishTimeModal(old => !old)}
        onSave={() => setShowPublishTimeModal(old => !old)}
        onSelectType={setSelectedPublishTimeType}
        onSelectDateTime={setSelectedPublishDateTime}
      />
      <PreviewModal
        showPreview={previewNotification}
        onClose={() => {
          setPreviewNotification(old => !old)
          setPreviewData(null)
        }}
        loading={false}
        previewData={previewData || {}}
      />
    </section>
  )
}

export default CreateNotification
