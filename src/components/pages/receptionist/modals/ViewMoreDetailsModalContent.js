import P from 'prop-types'

function RowStyle({ header, child, child2 }) {
  return (
    <>
      <div className="flex flex-row">
        <p className="text-gray-900 font-bold">{header}</p>
        <p>{child}</p>
        {child2 && <p className="text-grey-800">{child2}</p>}
      </div>
    </>
  )
}

function ModalContent() {
  return (
    <>
      <div className="w-full flex flex-col">
        <div className="flex flex-col">
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

export default ModalContent
