import PropTypes from 'prop-types'

function Component({ activeTab, handleTab, tabs }) {
  return (
    <div className="content-tabs">
      {tabs.map(({ label, value }) => (
        <div
          className={`tab ${value === activeTab ? 'active' : ''}`}
          onClick={e => {
            handleTab(value)
          }}
          onKeyDown={() => {
            handleTab(value)
          }}
          key={value}
          role="tab"
          tabIndex={value}
        >
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

Component.propTypes = {
  activeTab: PropTypes.number.isRequired,
  handleTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(Object).isRequired
}

export default Component
