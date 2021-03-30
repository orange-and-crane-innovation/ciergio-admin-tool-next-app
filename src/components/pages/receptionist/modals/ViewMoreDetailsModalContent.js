import { useEffect, useState } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { GET_UNITS } from '../query'

function RowStyle({ header, child, child2 }) {
  return (
    <>
      <div className="flex flex-col mb-4">
        <div
          className="p-0 mb-2 leading-5 text-neutral-dark font-body font-bold text-md"
          style={{ margin: '0px !important; ' }}
        >
          {header}
        </div>
        <p className="p-0 m-0 text-neutral-dark">{child}</p>
        {child2 && <p className="p-0 m-0 bg-black">{child2}</p>}
      </div>
    </>
  )
}

function ModalContent({ unitId }) {
  const { loading, data, error } = useQuery(GET_UNITS, {
    variables: { where: null }
  })
  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Company" child="Test" />
          <RowStyle header="Vistor" child="Test2" />
        </div>
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Company" child="Test" />
          <RowStyle header="Vistor" child="Test2" />
        </div>
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Company" child="Test" />
          <RowStyle header="Vistor" child="Test2" />
        </div>
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Company" child="Test" />
          <RowStyle header="Vistor" child="Test2" />
        </div>
      </div>
    </>
  )
}

RowStyle.propTypes = {
  header: P.string.isRequired,
  child: P.string.isRequired,
  child2: P.string
}

ModalContent.propTypes = {
  unitId: P.oneOfType[(P.string, null)]
}

export default ModalContent
