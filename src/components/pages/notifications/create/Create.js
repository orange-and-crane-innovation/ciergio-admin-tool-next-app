import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from '@apollo/client'
import axios from '@app/utils/axios'
import dayjs from 'dayjs'

import { Card } from '@app/components/globals'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'
import SelectCategory from '@app/components/globals/SelectCategory'

import showToast from '@app/utils/toast'
import { DATE } from '@app/utils'
import { CREATE_POST_MUTATION } from '../queries'
import { ACCOUNT_TYPES } from '@app/constants'

import AudienceModal from '../components/AudienceModal'
import PublishTimeModal from '../components/PublishTimeModal'
import PreviewModal from '../components/PreviewModal'
import AudienceType from '../components/AudienceType'
import PublishType from '../components/PublishType'

import Can from '@app/permissions/can'
import style from './Create.module.css'

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .label('Title')
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65)
    .required(),
  content: yup.mixed().label('Content').nullable().required(),
  embeddedFiles: yup.array().label('Image').nullable().required(),
  category: yup.string().label('Category').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65),
  content: yup.mixed().label('Content').nullable(),
  embeddedFiles: yup.array().label('Image').nullable(),
  category: yup.string().label('Category').nullable()
})

function CreateNotification() {
  const { push } = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [fileUploadError, setFileUploadError] = useState()
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAudienceType, setSelectedAudienceType] = useState('all')
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState(
    new Date()
  )
  const [selectedRecurring, setSelectedRecurring] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()
  const [selectedComplexExcept, setSelectedComplexExcept] = useState()
  const [selectedComplexSpecific, setSelectedComplexSpecific] = useState()
  const [selectedBuildingExcept, setSelectedBuildingExcept] = useState()
  const [selectedBuildingSpecific, setSelectedBuildingSpecific] = useState()
  const [selectedPublishTimeType, setSelectedPublishTimeType] = useState()
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const [showPublishTimeModal, setShowPublishTimeModal] = useState(false)
  const [previewNotification, setPreviewNotification] = useState(false)
  const [inputMaxLength] = useState(65)
  const [maxFiles] = useState(1)
  const [textCount, setTextCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState()
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
      selectedStatus === 'draft' || selectedStatus === 'preview'
        ? validationSchemaDraft
        : validationSchema
    ),
    defaultValues: {
      title: '',
      content: null,
      category: null,
      embeddedFiles: null
    }
  })

  register({ name: 'embeddedFiles' })

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

        reset()
        resetForm()
        goToPageLists()

        switch (selectedStatus) {
          case 'draft':
            message = `You have successfully draft a notification.`
            break
          default:
            message = `You have successfully published a notification.`
            break
        }

        showToast('success', message)
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate, reset])

  const goToPageLists = () => {
    let pageType

    if (selectedStatus === 'draft') {
      pageType = 'draft'
    } else if (!dayjs().isAfter(dayjs(new Date(selectedPublishDateTime)))) {
      pageType = 'upcoming'
    } else {
      pageType = 'published'
    }

    push(`/notifications/list/${pageType}`)
  }

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
          const imageData = response.data.map(item => {
            return {
              url: item.location,
              type: item.mimetype
            }
          })

          setFileUploadedData(imageData)
          setFileUploadError(null)
        }
      })
      .catch(function (error) {
        const errMsg = 'Failed to upload image. Please try again.'
        console.log(error)
        showToast('danger', errMsg)
        setFileUploadError(errMsg)
        setValue('embeddedFiles', null)
      })
      .then(() => {
        setLoading(false)
      })
  }

  const onSubmit = (data, status) => {
    if (status === 'preview') {
      setPreviewData({
        primaryMedia: fileUploadedData,
        title: data?.title,
        content: data?.content?.replace(/(&nbsp;)+/g, '')
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
        type: 'flash',
        categoryId: data.category,
        title: data?.title || 'Untitled',
        content: data?.content?.replace(/(&nbsp;)+/g, ''),
        audienceType: selectedAudienceType,
        status:
          !dayjs().isAfter(dayjs(new Date(selectedPublishDateTime))) &&
          status !== 'draft'
            ? 'scheduled'
            : status,
        primaryMedia: fileUploadedData
      }

      if (selectedPublishDateTime) {
        createData.publishedAt = DATE.toFriendlyISO(selectedPublishDateTime)
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

      if (selectedRecurring?.isRepeat) {
        createData.status = 'scheduled'

        createData.publishedAt = DATE.toFriendlyISO(
          dayjs(new Date(selectedPublishDateTime)).add(5, 'minute')
        )

        createData.recurringSchedule = {
          type:
            selectedRecurring.selectedRepeatOption.value === 'custom'
              ? selectedRecurring?.selectedRepeatEveryOption?.value
              : selectedRecurring.selectedRepeatOption.value
        }

        if (selectedRecurring.selectedRepeatOption.value === 'weekly') {
          createData.recurringSchedule = {
            ...createData.recurringSchedule,
            properties: {
              ...createData.recurringSchedule.properties,
              dayOfWeek: Array.from(Array(7).keys())
            }
          }
        }

        if (selectedRecurring.selectedRepeatOption.value === 'monthly') {
          createData.recurringSchedule = {
            ...createData.recurringSchedule,
            properties: {
              ...createData.recurringSchedule.properties,
              date: Array.from({ length: 31 }, (_, i) => i + 1)
            }
          }
        }

        if (
          selectedRecurring.selectedRepeatOption.value === 'custom' &&
          selectedRecurring.selectedRepeatEveryOption.value === 'weekly'
        ) {
          createData.recurringSchedule = {
            ...createData.recurringSchedule,
            properties: {
              ...createData.recurringSchedule.properties,
              dayOfWeek:
                selectedRecurring.selectedDays.length > 0
                  ? selectedRecurring.selectedDays
                  : Array.from(Array(7).keys())
            }
          }
        }

        if (
          selectedRecurring.selectedRepeatOption.value === 'custom' &&
          selectedRecurring.selectedRepeatEveryOption.value === 'monthly'
        ) {
          createData.recurringSchedule = {
            ...createData.recurringSchedule,
            properties: {
              ...createData.recurringSchedule.properties,
              date:
                selectedRecurring.datesSelected.length > 0
                  ? selectedRecurring.datesSelected
                  : Array.from({ length: 31 }, (_, i) => i + 1)
            }
          }
        }

        if (
          selectedRecurring.selectedRepeatEndOption === 'on' &&
          selectedRecurring.selectedRepeatDate
        ) {
          createData.recurringSchedule = {
            ...createData.recurringSchedule,
            end: {
              date: DATE.toFriendlyISO(selectedRecurring.selectedRepeatDate)
            }
          }
        }

        if (
          selectedRecurring.selectedRepeatEndOption === 'after' &&
          selectedRecurring.instance
        ) {
          createData.recurringSchedule = {
            ...createData.recurringSchedule,
            end: {
              instance: Number(selectedRecurring.instance)
            }
          }
        }
      }

      createPost({ variables: { data: createData } })
    }
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length > maxFiles) {
        showToast('info', `Maximum of ${maxFiles} image only`)
      } else {
        setLoading(true)
        setFileUploadError(null)

        if (errors?.embeddedFiles?.message) {
          errors.embeddedFiles.message = null
        }

        for (const file of files) {
          const reader = new FileReader()

          reader.onloadend = () => {
            setImageUrls(imageUrls => [...imageUrls, reader.result])
          }
          reader.readAsDataURL(file)

          formData.append('files', file)
          fileList.push(file)
        }
        setValue('embeddedFiles', fileList)

        uploadApi(formData)
      }
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
    setValue('embeddedFiles', images.length !== 0 ? images : null)
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

  const resetForm = () => {
    setLoading(false)
    setImageUrls([])
    setFileUploadedData([])
    setShowAudienceModal(false)
    setShowPublishTimeModal(false)
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

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const onCategorySelect = e => {
    setSelectedCategory(e.value !== '' ? e.value : null)
  }

  const onClearCategory = () => {
    setSelectedCategory(null)
  }

  const onUpdateStatus = data => {
    setSelectedStatus(data)
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">Create a Notification</h1>
      <form>
        <div className="flex justify-between text-base">
          <div className="w-full md:w-9/12">
            <Card
              content={
                <div className="p-4">
                  <div className="title">
                    <h1 className="pb-4 text-base font-bold">Title</h1>
                    <div className={style.PostSubContent}>
                      <div className={style.PostSubContentGrow}>
                        <Controller
                          name="title"
                          control={control}
                          render={({ name, value, onChange }) => (
                            <FormInput
                              inputClassName={style.PostInputCustom}
                              type="text"
                              name={name}
                              value={value}
                              placeholder="What's the title of your notification?"
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
                      <div className={style.PostCounter}>
                        {textCount}/{inputMaxLength}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h1 className="pb-4 font-bold">Content</h1>
                    <Controller
                      control={control}
                      name="content"
                      render={({ name, value, onChange }) => (
                        <FormTextArea
                          name={name}
                          value={value}
                          onChange={onChange}
                          options={['history']}
                          placeholder="Write your text here"
                          error={errors?.content?.message ?? null}
                          stripHtmls
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
                          maxImages={maxFiles}
                          images={imageUrls}
                          loading={loading}
                          error={
                            errors?.embeddedFiles?.message ??
                            fileUploadError ??
                            null
                          }
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
              title={<h1 className="text-base font-bold">Category</h1>}
              content={
                <div className="p-4 w-full border-t ">
                  <Controller
                    control={control}
                    name="category"
                    render={({ name, onChange, value }) => (
                      <SelectCategory
                        placeholder="Select a Category"
                        type="flash"
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
              }
            />
            <Card
              title={<h1 className="text-base font-bold ">Publish Details</h1>}
              content={
                <div className="flex flex-col items-start w-full border-t md:flex-row p-4">
                  <div className="w-full md:w-1/2">
                    <div className="flex mb-2">
                      <span style={{ minWidth: '65px' }}>Status:</span>
                      <span className="font-bold">New</span>
                    </div>
                    <AudienceType
                      audienceType={selectedAudienceType}
                      specificCompanies={selectedCompanySpecific}
                      excludedCompanies={selectedCompanyExcept}
                      specificComplexes={selectedComplexSpecific}
                      excludedComplexes={selectedComplexExcept}
                      specificBuildings={selectedBuildingSpecific}
                      excludedBuildings={selectedBuildingExcept}
                      onShowAudienceModal={() =>
                        setShowAudienceModal(old => !old)
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <PublishType
                      onShowPublishTypeModal={() =>
                        setShowPublishTimeModal(old => !old)
                      }
                      publishType={selectedPublishTimeType}
                      publishDateTime={selectedPublishDateTime}
                      recurringData={selectedRecurring}
                    />
                  </div>
                </div>
              }
            />
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div>
                <Can
                  perform="notifications:draft"
                  yes={
                    <Button
                      default
                      label="Save as Draft"
                      onMouseDown={() => onUpdateStatus('draft')}
                      onClick={handleSubmit(e => {
                        onSubmit(e, 'draft')
                      })}
                      className="mr-4"
                    />
                  }
                  no={
                    <Button
                      default
                      label="Save as Draft"
                      disabled
                      className="mr-4"
                    />
                  }
                />
              </div>

              <div>
                <Can
                  perform="notifications:view"
                  yes={
                    <Button
                      default
                      label="Preview"
                      onMouseDown={() => onUpdateStatus('preview')}
                      onClick={handleSubmit(e => {
                        onSubmit(e, 'preview')
                      })}
                      className="mr-4"
                    />
                  }
                  no={
                    <Button default label="Preview" disabled className="mr-4" />
                  }
                />

                <Can
                  perform="notifications:create"
                  yes={
                    <Button
                      primary
                      label="Publish"
                      onMouseDown={() => onUpdateStatus('active')}
                      onClick={handleSubmit(e => {
                        onSubmit(e, 'active')
                      })}
                    />
                  }
                  no={<Button primary disabled label="Publish" />}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <AudienceModal
        visible={showAudienceModal}
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
        visible={showPublishTimeModal}
        onCancel={() => setShowPublishTimeModal(old => !old)}
        onSave={() => setShowPublishTimeModal(old => !old)}
        onSelectType={setSelectedPublishTimeType}
        onSelectDateTime={setSelectedPublishDateTime}
        onSelectRecurring={setSelectedRecurring}
        valuePublishType={selectedPublishTimeType}
        valueDateTime={selectedPublishDateTime}
        valueRecurring={selectedRecurring}
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
