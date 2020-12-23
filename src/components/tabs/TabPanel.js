import P from 'prop-types'

const TabPanel = ({ activeId, id, children }) => {
  return activeId === id ? children : null
}

TabPanel.propTypes = {
  activeId: P.string,
  id: P.string,
  children: P.any
}

export default TabPanel
