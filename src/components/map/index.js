import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Map as GoogleMap, GoogleApiWrapper, Marker } from 'google-maps-react'

import FormInput from '@app/components/forms/form-input'
import PageLoader from '@app/components/page-loader'

const Map = ({ google, getMapValue }) => {
  const [currentLocation, setCurrentLocation] = useState()
  const [selectedPlace, setSelectedPlace] = useState()
  const mapRef = useRef()

  const mapStyles = {
    position: 'relative',
    width: '100%',
    height: 'calc(50vh)'
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        function (error) {
          console.error('Error Code = ' + error.code + ' - ' + error.message)
        }
      )
    }
  }, [])

  const mapClicked = (mapProps, map, e) => {
    if (e.placeId) {
      const geocoder = new mapProps.google.maps.Geocoder()
      geocoder.geocode({ placeId: e.placeId }, results => {
        if (results.length !== 0) {
          const place = new mapProps.google.maps.places.PlacesService(map)
          let selectedCity

          place.getDetails({ placeId: e.placeId }, (place, status) => {
            if (status === mapProps.google.maps.places.PlacesServiceStatus.OK) {
              setCurrentLocation({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              })
              setSelectedPlace({ name: place.formatted_address })

              map.setCenter(place.geometry.location)
              map.setZoom(17)

              for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0]
                const addressCity = place.address_components[i].long_name

                if (addressType === 'locality') {
                  selectedCity = addressCity
                }
              }

              getMapValue({
                address: {
                  formattedAddress: place.formatted_address,
                  city: selectedCity
                },
                coordinates: {
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng()
                }
              })
            }
          })
        }
      })
    }
  }

  const searchLocation = e => {
    const autocomplete = new google.maps.places.SearchBox(e.target)

    autocomplete.addListener('places_changed', () => {
      const places = autocomplete.getPlaces()
      let selectedCity

      if (places.length === 1 && places[0].adr_address) {
        setCurrentLocation({
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng()
        })
        setSelectedPlace({ name: places[0].formatted_address })

        mapRef.current.map.setCenter(places[0].geometry.location)
        mapRef.current.map.setZoom(17)

        for (let i = 0; i < places[0].address_components.length; i++) {
          const addressType = places[0].address_components[i].types[0]
          const addressCity = places[0].address_components[i].long_name

          if (addressType === 'locality') {
            selectedCity = addressCity
          }
        }

        getMapValue({
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
    <div className="relative w-full h-full">
      <FormInput
        id="location"
        name="location"
        type="text"
        placeholder="Search places"
        onChange={searchLocation}
      />
      <p className="my-2">
        <span className="font-bold">Selected: </span>
        <span>{selectedPlace && selectedPlace.name}</span>
      </p>
      {currentLocation ? (
        <GoogleMap
          ref={mapRef}
          containerStyle={{ position: 'relative' }}
          style={mapStyles}
          google={google}
          zoom={17}
          initialCenter={currentLocation}
          clickableIcons={true}
          centerAroundCurrentLocation={false}
          disableDoubleClickZoom={true}
          draggableCursor={'pointer'}
          mapTypeId={'roadmap'}
          scaleControl={true}
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          onClick={mapClicked}
        >
          <Marker position={currentLocation} name="Current location" />
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center" style={mapStyles}>
          <PageLoader />
        </div>
      )}
    </div>
  )
}

Map.propTypes = {
  google: PropTypes.any,
  getMapValue: PropTypes.any
}

const LoadingContainer = () => <PageLoader />

export default GoogleApiWrapper({
  apiKey: process.env.GATSBY_GOOGLE_MAPS_API,
  LoadingContainer: LoadingContainer
})(Map)
