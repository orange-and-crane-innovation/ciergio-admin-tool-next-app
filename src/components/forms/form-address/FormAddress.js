import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { GoogleApiWrapper } from 'google-maps-react'
import { FaRegMap } from 'react-icons/fa'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'
import Map from '@app/components/map'

const FormAddress = ({
  name,
  value,
  placeholder,
  error,
  onChange,
  getValue
}) => {
  const [modal, setModal] = useState({
    modalOpen: false,
    modalHeader: null,
    modalContent: false
  })

  useEffect(() => {
    setAddress({})
  })

  const closeModal = () => {
    setModal({ ...modal, modalOpen: false })
  }

  const setValue = () => {
    setModal({ ...modal, modalOpen: false })
    getValue(getAddress())
  }

  const getMapValue = e => {
    if (e) {
      setAddress(e)
    }
  }

  const setAddress = data => {
    window.localStorage.Address = JSON.stringify(data)
  }

  const getAddress = () =>
    window.localStorage.Address ? JSON.parse(window.localStorage.Address) : {}

  const showMap = () => {
    setModal({
      modalOpen: true
    })
  }

  const searchLocation = e => {
    // eslint-disable-next-line no-undef
    const autocomplete = new google.maps.places.SearchBox(e.target)

    autocomplete.addListener('places_changed', () => {
      const places = autocomplete.getPlaces()
      let selectedCity

      if (places.length === 1 && places[0].adr_address) {
        for (let i = 0; i < places[0].address_components.length; i++) {
          const addressType = places[0].address_components[i].types[0]
          const addressCity = places[0].address_components[i].long_name

          if (addressType === 'locality') {
            selectedCity = addressCity
          }
        }

        getValue({
          address: {
            formattedAddress: places[0].formatted_address,
            city: selectedCity
          },
          coordinates: {
            latitude: places[0].geometry.location.lat(),
            longitude: places[0].geometry.location.lng()
          }
        })
      }
    })
  }
  return (
    <>
      <FormInput
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => {
          searchLocation(e)
          onChange(e)
        }}
        error={error}
        icon={<FaRegMap />}
        iconOnClick={showMap}
      />

      <Modal
        title="Select a location"
        visible={modal.modalOpen}
        onClose={closeModal}
        onOk={setValue}
        onCancel={closeModal}
      >
        <Map getMapValue={getMapValue} />
      </Modal>
    </>
  )
}

FormAddress.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  getValue: PropTypes.any
}

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
})(FormAddress)
