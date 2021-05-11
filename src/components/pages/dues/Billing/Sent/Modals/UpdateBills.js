import { useState, useMemo } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import FileUpload from '@app/components/forms/form-fileupload'
import Modal from '@app/components/modal'
import Button from '@app/components/button'
import axios from 'axios'
import { DateInput } from '@app/components/datetime'
import Can from '@app/permissions/can'

export default function UpdateBills({
  amount,
  dueDate,
  fileUrl,
  getData,
  isClose,
  id
}) {
  const [selectedDate, setSelectedDate] = useState(new Date(dueDate))

  const [data, setData] = useState({
    attachment: {
      fileUrl,
      fileType: 'pdf'
    },
    amount,
    dueDate: dueDate,
    id
  })
  const [confirmationModal, setConfirmationModal] = useState(false)
  const handleChangeDate = date => {
    console.log(date)
    setSelectedDate(new Date(date))
    setData(prevState => ({ ...prevState, dueDate: new Date(date) }))
  }

  const handleTextChange = e => {
    const amount = e.target.value
    if (/^(\s*|\d+)$/.test(amount)) {
      setData(prevState => ({ ...prevState, amount }))
    }
  }

  const handleClearConfirmationModal = () => {
    setConfirmationModal(false)
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
      setConfirmationModal(false)
    }
  }

  const submitButton = useMemo(() => {
    return (
      <Can
        perform="dues:update"
        yes={
          <Button
            primary
            disabled={
              data.dueDate === dueDate &&
              data.amount === amount &&
              data.attachment.fileUrl === fileUrl
            }
            label="Submit"
            onClick={() => setConfirmationModal(show => !show)}
          />
        }
        no={<Button primary disabled label="Submit" />}
      />
    )
  }, [data])

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
            value={data ? data.amount : ''}
            name="amount"
            inputClassName="w-full rounded border-gray-300"
          />
          {selectedDate && (
            <>
              <DateInput
                date={selectedDate}
                onDateChange={handleChangeDate}
                minDate={true}
                label="Due Date"
                dateFormat="MMMM DD, YYYY"
              />
            </>
          )}
        </div>

        <div className="w-full flex flex-row justify-between mt-4">
          <Button
            default
            label="Cancel"
            onClick={() => setConfirmationModal(false)}
          />
          {submitButton}
        </div>
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
  form: P.object,
  getData: P.func,
  isClose: P.bool,
  id: P.any
}
