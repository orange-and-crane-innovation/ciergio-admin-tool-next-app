import P from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { useLazyQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPaymentValidationSchema } from './schema'
import axios from 'axios'

function CreatePaymentModal({ open, handleDisplay }) {
  const profile = JSON.parse(localStorage.getItem('profile'))
  const companyID = profile?.accounts?.data[0]?.company?._id
  const {
    control,
    errors,
    watch: watchPaymentLink,
    reset: resetPaymentLink,
    getValues: getPaymentLinkValues,
    trigger: triggerPaymentLink,
    register: registerPaymentLink
  } = useForm({
    resolver: yupResolver(createPaymentValidationSchema),
    defaultValues: {
      amount: null,
      firstName: null,
      lastName: null,
      email: null,
      mobile: null
    }
  })

  const uploadApi = async payload => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_OCI_PAYMENT_API}/altpaynet/epl/checkout`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          order_type: 'payment_link'
        }
      }
    )

    if (response) {
      handleDisplay(false)
    }
  }

  const handleOnCreate = async () => {
    // setShowCreateModalModal(false)
    const validate = await triggerPaymentLink()

    // eslint-disable-next-line no-constant-condition
    if (validate) {
      const values = getPaymentLinkValues()
      const { firstName, lastName, email, mobile, amount } = values
      const payload = {
        srcName: 'company',
        srcId: companyID,
        paymentDetails: {
          amount: amount?.trim(),
          currency: 'PHP',
          customer: {
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            email: email?.trim(),
            mobile: mobile?.trim()
          }
        }
      }
      console.log('values', payload)
      uploadApi(payload)
    } else {
      console.log('validation failed')
    }
  }

  return (
    <Modal
      title="New Payment Link"
      okText="Create Payment"
      visible={open}
      onClose={() => {
        handleDisplay(false)
      }}
      onCancel={() => {
        handleDisplay(false)
      }}
      // okButtonProps={{
      //   loading
      // }}
      onOk={handleOnCreate}
      width={450}
    >
      <div className="w-full p-4">
        <form>
          <div className="mb-8">
            <p className="font-bold text-base text-gray-900 mb-2">Amount</p>
            <Controller
              name="amount"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    style={{
                      width: '100%$',
                      'border-radius': '0.375rem',
                      'border-color':
                        'rgba(224, 224, 224, var(--tw-border-opacity))'
                    }}
                    type="number"
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter amount"
                    error={errors?.amount?.message}
                  />
                )
              }}
            />
          </div>
          <div className="mb-8">
            <p className="font-bold text-base text-gray-900 mb-2">
              Payor Details
            </p>
          </div>
          <div className="mb-4">
            <p className="font-bold text-base text-gray-500 mb-2">First Name</p>
            <Controller
              name="firstName"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter first name"
                    error={errors?.firstName?.message}
                  />
                )
              }}
            />
          </div>
          <div>
            <p className="font-bold text-base text-gray-500 mb-2">Last Name</p>
            <Controller
              name="lastName"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter last name"
                    error={errors?.lastName?.message}
                  />
                )
              }}
            />
          </div>
          <div>
            <p className="font-bold text-base text-gray-500 mb-2">Email</p>
            <Controller
              name="email"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter email"
                    error={errors?.email?.message}
                  />
                )
              }}
            />
          </div>
          <div>
            <p className="font-bold text-base text-gray-500 mb-2">
              Mobile number
            </p>
            <Controller
              name="mobile"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter mobile number"
                    error={errors?.mobile?.message}
                  />
                )
              }}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

// CreatePaymentModal.propTypes = {
//   form: P.object,
//   open: P.bool,
//   loading: P.bool,
//   onOk: P.func,
//   onCancel: P.func,
//   selectedStaff: P.object
// }

export default CreatePaymentModal
