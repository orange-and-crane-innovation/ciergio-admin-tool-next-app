import React, { useState } from 'react'
import { Card } from '@app/components/globals'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'
import UploaderImage from '@app/components/uploader/image'

function CreateNotification() {
  const [notificationTitle, setNotificationTitle] = useState('')
  return (
    <section className="content-wrap pt-4 pb-8 px-8">
      <h1 className="content-title">Create a Notification</h1>
      <div className="flex justify-between">
        <div className="w-9/12 mr-8">
          <Card
            content={
              <div className="p-4">
                <div className="title">
                  <h1 className="pb-4 text-base text-gray-500 font-bold">
                    Title
                  </h1>
                  <FormInput
                    value={notificationTitle}
                    onChange={e => setNotificationTitle(e.target.title)}
                    placeholder={`What's is the title of your notification?`}
                  />
                </div>
                <div className="message mt-8">
                  <h1 className="pb-4 text-base text-gray-500 font-bold">
                    Content
                  </h1>
                  <FormTextArea />
                </div>
              </div>
            }
          />
          <div className="w-full mt-8">
            <Card
              content={
                <>
                  <div className="p-4 border-b">
                    <h1 className="font-bold text-base">Featured Image</h1>
                  </div>
                  <div className="p-4">
                    <p>
                      You may feature a single image. This image will appear
                      when viewing the notification within the app.
                    </p>
                    <div className="my-4">
                      <UploaderImage />
                    </div>
                  </div>
                </>
              }
            />
          </div>
        </div>

        <div className="w-3/12">
          <Card
            content={
              <div className="p-4">
                <h1 className="text-base font-bold mb-4">Categories</h1>
                <FormSelect
                  options={[
                    {
                      label: 'Announcements',
                      value: 'announcements'
                    }
                  ]}
                  onChange={() => {}}
                />
              </div>
            }
          />
          <Card
            content={
              <div>
                <div className="mb-4 p-4 border-b">
                  <h1 className="text-base font-bold ">Publish Details</h1>
                </div>
                <div className="mb-4 p-4 border-b">
                  <div>
                    <span>Status:</span> <span className="font-bold">New</span>
                  </div>
                  <div>
                    <span>Audience:</span>{' '}
                    <span className="font-bold">All</span>
                  </div>
                  <div>
                    <span>Publish:</span>{' '}
                    <span className="font-bold">Immediately</span>
                  </div>
                </div>
                <div className="px-4">
                  <Button primary label="Publish" className="w-full" />
                </div>
              </div>
            }
          />
          <div className="w-full flex justify-between">
            <Button
              default
              label="Save as Draft"
              onClick={() => {}}
              className="w-1/2 mr-4"
            />
            <Button
              default
              label="Preview"
              onClick={() => {}}
              className="w-1/2"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateNotification
