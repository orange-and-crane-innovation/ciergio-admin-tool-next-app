/* eslint-disable react/jsx-key */
import React, { useState } from 'react'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import Uploader from '@app/components/uploader'
import showToast from '@app/utils/toast'

import style from './Create.module.css'

const CreatePosts = () => {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState({})
  const [fileUrls, setFileUrls] = useState([])
  const [maxFiles] = useState(3)
  const [inputMaxLength] = useState(65)
  const [textCount, setTextCount] = useState(0)

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const onUploadFile = e => {
    const data = e.target.files ? e.target.files : e.dataTransfer.files

    if (data) {
      if (data.length > maxFiles) {
        showToast('info', `Maximum of ${maxFiles} files only`)
      } else {
        setLoading(true)
        for (const file of data) {
          const reader = new FileReader()

          reader.onloadend = () => {
            setFiles(data)
            setFileUrls(fileUrls => [...fileUrls, reader.result])
            setLoading(false)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const onRemoveFile = e => {
    const url = fileUrls.filter(file => {
      return file !== e.currentTarget.dataset.id
    })
    setFileUrls(url)
  }

  return (
    <div className={style.CreatePostContainer}>
      <h1 className={style.CreatePostHeader}>Upload a Form</h1>

      <Card
        content={
          <div className={style.CreateContentContainer}>
            <h2 className={style.CreatePostHeaderSmall}>Title</h2>
            <div className={style.CreatePostSubContent}>
              <div className={style.CreatePostSubContentGrow}>
                <FormInput
                  inputClassName={style.CreatePostInputCustom}
                  type="text"
                  name="title"
                  placeholder="What's the title of your download form?"
                  maxLength={inputMaxLength}
                  count={textCount}
                  onChange={onCountChar}
                />
              </div>
              <div className={style.CreatePostCounter}>
                {textCount}/{inputMaxLength}
              </div>
            </div>
            <h2 className={style.CreatePostHeaderSmall}>Description</h2>
            <FormTextArea
              maxLength={500}
              placeholder="(Optional) You may add additional notes here."
              options={['history']}
              withCounter
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
              files={files}
              fileUrls={fileUrls}
              loading={loading}
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
                  Status: <strong>Scheduled</strong>
                </span>
                <span>
                  Audience: <strong>Building (1) </strong>
                  <span className={style.CreatePostLink}>Edit</span>
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
          label="Save as Draft"
          className={style.CreatePostFooterButton}
        />
        <span>
          <Button type="button" label="Publish" primary />
        </span>
      </div>
    </div>
  )
}

export default CreatePosts
