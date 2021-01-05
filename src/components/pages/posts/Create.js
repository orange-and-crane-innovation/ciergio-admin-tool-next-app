/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { FaSpinner, FaTimes } from 'react-icons/fa'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'
import showToast from '@app/utils/toast'

import style from './Create.module.css'

const CreatePosts = () => {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [maxImages] = useState(3)
  const [videoUrl, setVideoUrl] = useState()
  const [videoError, setVideoError] = useState()
  const [videoLoading, setVideoLoading] = useState(false)
  const [inputMaxLength] = useState(65)
  const [textCount, setTextCount] = useState(0)

  const limitOptions = [
    {
      label: 'Announcements',
      value: 'Announcements'
    },
    {
      label: 'Attractions',
      value: 'Attractions'
    },
    {
      label: 'Events',
      value: 'Events'
    }
  ]

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files

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
        }
      }
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
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

  return (
    <div className={style.CreatePostContainer}>
      <h1 className={style.CreatePostHeader}>Create a Post</h1>

      <Card
        header={<span className={style.CardHeader}>Featured Media</span>}
        content={
          <div className={style.CreateContentContainer}>
            <UploaderImage
              multiple
              maxImages={maxImages}
              imageUrls={imageUrls}
              loading={loading}
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
                <FormInput
                  inputClassName={style.CreatePostInputCustom}
                  type="text"
                  name="title"
                  placeholder="What's the title of your bulletin post?"
                  maxLength={inputMaxLength}
                  count={textCount}
                  onChange={onCountChar}
                />
              </div>
              <div className={style.CreatePostCounter}>
                {textCount}/{inputMaxLength}
              </div>
            </div>
            <h2 className={style.CreatePostHeaderSmall}>Content</h2>
            <FormTextArea
              maxLength={500}
              options={['link', 'history']}
              placeholder="Write your text here"
              withCounter
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
                  <FormInput
                    name="video"
                    placeholder="Add Youtube link here"
                    onBlur={onCountChar}
                    onChange={onVideoChange}
                    value={videoUrl || ''}
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
              <div className={style.CreatePostVideoContent}>
                <div className={style.CreatePostVideoInput}>Preview Video</div>
                <div className={style.CreatePostVideoContainer}>
                  <ReactPlayer
                    controls
                    width="100%"
                    height="100%"
                    className={style.CreatePostVideoPlayer}
                    url={videoUrl}
                    onError={onVideoError}
                    onReady={onVideoReady}
                  />
                </div>
              </div>
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
              <FormSelect
                options={limitOptions}
                placeholder="Choose Category"
                onChange={e => alert('Selected ' + e.target.value)}
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
                  Status: <strong>Scheduled</strong>
                </span>
                <span>
                  Audience: <strong>Building (1) </strong>
                  <span className={style.CreatePostLink}>Edit</span>
                </span>
              </div>

              <div className={style.CreatePostPublishMarginContainer}>
                Publish: <strong>Scheduled, May 1, 2019, 6:20PM </strong>
                <span className={style.CreatePostLink}>Edit</span>
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
          <Button
            default
            type="button"
            label="Preview"
            className={style.CreatePostFooterButton}
          />
          <Button type="button" label="Publish Post" primary />
        </span>
      </div>
    </div>
  )
}

export default CreatePosts
