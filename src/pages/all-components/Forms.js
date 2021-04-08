import React, { useState } from 'react'

import { Button, FormInput, FormSelect } from '@app/components/globals'

import FormTextArea from '@app/components/forms/form-textarea'
import UploaderImage from '@app/components/uploader/image'
import DatePicker from '@app/components/forms/form-datepicker/'

import Highlight from './highlight'

function Components() {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const [date, setDate] = useState(new Date())

  const handleChangeDate = date => {
    setDate(date)
  }

  const onUploadImage = e => {
    const reader = new FileReader()
    const formData = new FormData()
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]

    setLoading(true)
    if (file) {
      reader.onloadend = () => {
        setImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
      formData.append('files', file)
      setLoading(false)
    }
  }

  const onRemoveImage = () => {
    setImageUrl(null)
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="">
        <h1 className="text-xl font-semibold">Inputs</h1>
        <FormInput
          label="Label"
          placeholder="Type your name"
          hint="Ciergio invite will be sent to this email."
        />
        <Highlight
          code={`<FormInput 
            type="password" //default to text
            label="Label" //optional
            placeholder="Type your name" optional
            className="custom-class" //optional
            hint="Ciergio invite will be sent to this email." />
          />`}
        />
        <FormInput
          label="With Icon"
          placeholder="Search"
          rightIcon="ciergio-search"
        />
        <Highlight
          code={`<FormInput 
            label="With Icon"
            placeholder="Search"
            rightIcon="ciergio-search"
          />`}
        />
      </div>
      <div className="">
        <h1 className="text-xl font-semibold">Buttons</h1>
        <div className="inline-flex space-x-4 mb-2">
          <div className="flex-1">
            <Button />
          </div>
          <div className="flex-1">
            <Button primary />
          </div>
          <div className="flex-1">
            <Button label="Custom" />
          </div>
        </div>
        <div className="mb-2">
          <Button primary full />
        </div>
        <div className="mb-2">
          <Button full leftIcon="ciergio-circle-plus" label="Custom Label" />
        </div>

        <Highlight
          code={`<Button primary />
            <Button full />
            <Button label="Custom" />
            <Button primary full />
            <Button onClick="(e)=>{}" />
            <Button 
              full 
              leftIcon="ciergio-circle-plus" 
              label="Custom Label"
            />
          `}
        />
      </div>
      {/* SELECT FORM */}
      <div className="">
        <h1 className="text-xl font-semibold">Select</h1>
        <FormSelect
          options={[
            { label: 'Option 1', value: 'option1val' },
            { label: 'Option 2', value: 'option2val' }
          ]}
        />

        <Highlight
          code={`<FormSelect
            options={[
              { label: 'Option 1', value: 'option1val' },
              { label: 'Option 2', value: 'option2val' }
            ]}
          />`}
        />
        <FormSelect
          options={[
            { label: 'Option 1', value: 'option1val' },
            { label: 'Option 2', value: 'option2val' }
          ]}
          label="With Label"
          hint="and hint"
        />

        <Highlight
          code={`<FormSelect
            options={[
              { label: 'Option 1', value: 'option1val' },
              { label: 'Option 2', value: 'option2val' }
            ]}
          />`}
        />
      </div>

      <div className="">
        <h1 className="text-xl font-semibold">Text Area</h1>
        <FormTextArea maxLength={500} withCounter />
        <br />
        <Highlight code={`<FormTextArea maxLength={500} withCounter />`} />
      </div>

      <div className="">
        <h1 className="text-xl font-semibold">Image Uploader</h1>
        <UploaderImage
          imageUrl={imageUrl}
          loading={loading}
          onUploadImage={onUploadImage}
          onRemoveImage={onRemoveImage}
        />
        <br />
        <Highlight
          code={` <UploaderImage
              imageUrl={imageUrl}
              loading={loading}
              onUploadImage={onUploadImage}
              onRemoveImage={onRemoveImage}
            />`}
        />
      </div>

      <div className="">
        <h1 className="text-xl font-semibold">Date Picker</h1>
        <DatePicker date={date} onChange={handleChangeDate} label="label" />
        <Highlight
          code={` <DatePicker
          date={date}
          onChange={handleChangeDate}
          label="Label" // Label 

        />`}
        />
        <DatePicker
          rightIcon
          date={date}
          onChange={handleChangeDate}
          label="With Icon"
        />
        <Highlight
          code={` <DatePicker
          rightIcon //With Icon
          date={date}
          onChange={handleChangeDate}
          label="Right Icon" // Label 
       
        />`}
        />
        <DatePicker
          rightIcon
          date={date}
          onChange={handleChangeDate}
          showMonthYearPicker
          label="Month Picker"
        />
        <Highlight
          code={` <DatePicker
          date={date}
          onChange={handleChangeDate}
          label="Month Picker" // Label 
          showMonthYearPicker // Month Picker
        />`}
        />
      </div>
    </div>
  )
}

export default Components
