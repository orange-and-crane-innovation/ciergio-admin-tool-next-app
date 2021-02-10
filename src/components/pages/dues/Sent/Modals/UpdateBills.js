import { useEffect, useState } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import FileUpload from '@app/components/forms/form-fileupload'
import Modal from '@app/components/modal'
import Button from '@app/components/button'
import axios from 'axios'

export default function UpdateBills({
  amount,
  dueDate,
  fileUrl,
  getData,
  isClose,
  id
}) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [text, setText] = useState('')
  const [data, setData] = useState({
    attachment: {
      fileUrl,
      fileType: 'pdf'
    },
    dueDate: dueDate,
    id
  })
  const [confirmationModal, setConfirmationModal] = useState(false)

  const handleChangeDate = dueDate => {
    setSelectedDate(dueDate)
    setData(prevState => ({ ...prevState, dueDate }))
  }

  const handleTextChange = e => {
    const amount = e.target.value
    setText(amount)
    setData(prevState => ({ ...prevState, amount: parseFloat(amount) }))
  }

  const handleClearConfirmationModal = () => {
    setConfirmationModal(show => !show)
  }

  const uploadApi = async (payload, name) => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response) {
      const imageData = response.data.map(item => {
        return {
          fileUrl: item.location,
          fileType: item.mimetype
        }
      })

      setData(prevState => ({
        ...prevState,
        attachment: { ...imageData[0] }
      }))
    }
  }

  const handleFile = file => {
    const formData = new FormData()
    const name = file.target.name
    const formName = `form${name[name.length - 1]}`
    const fileData = file.target.files
      ? file.target.files[0]
      : file.dataTransfer.files[0]
    if (file) {
      formData.append('photos', fileData)
    }
    uploadApi(formData, formName)
  }

  const handleConfirmUpdate = () => {
    if (data) {
      getData(data)
      isClose(true)
    }
  }

  return (
    <>
      <form className="custom-form w-label">
        <div className="w-full px-2 py-3">
          <div className="form-group">
            <label
              className="control-label text-gray-700 font-semibold"
              htmlFor="file"
            >
              Upload File:
            </label>
            <FileUpload
              name="file"
              id="file"
              fileUrl={fileUrl}
              getFile={handleFile}
            />
          </div>
          <FormInput
            label="Amount"
            placeholder={`₱ ${amount.toFixed(2)}`}
            type="text"
            onChange={handleTextChange}
            value={text}
            inputClassName="w-full rounded border-gray-300"
          />
          {selectedDate && (
            <>
              <label className="text-gray-700 font-semibold" htmlFor="dueDate">
                Due Date
              </label>
              <DatePicker
                inputClassname="w-screen"
                disabledPreviousDate={dueDate}
                date={selectedDate}
                onChange={handleChangeDate}
              />
            </>
          )}
        </div>

        <Button default label="Cancel" onClick={() => alert('clicked')} />
        <Button
          primary
          label="Submit"
          onClick={() => setConfirmationModal(show => !show)}
        />
      </form>

      <Modal
        title=""
        okText="Confirm"
        visible={confirmationModal}
        onClose={handleClearConfirmationModal}
        onOk={handleConfirmUpdate}
        cancelText="Cancel"
        onCancel={() => setConfirmationModal(old => !old)}
        width="700px"
      >
        <div className="w-full p-16">
          <p className="text-4xl text-gray-500">
            The resident may have already seen the file, but you can update the
            document if you made a mistake. Are you sure you want to update this
            file?
          </p>
        </div>
      </Modal>
    </>
  )
}

UpdateBills.propTypes = {
  amount: P.number,
  dueDate: P.string,
  fileUrl: P.string,
  form: P.object
}
