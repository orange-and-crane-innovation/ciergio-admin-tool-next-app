import P from 'prop-types'

const TabPanel = ({ activeid, id, children }) => {
  return activeid === id ? children : null
}

TabPanel.propTypes = {
  activeid: P.string,
  id: P.string,
  children: P.any
}

export default TabPanel
