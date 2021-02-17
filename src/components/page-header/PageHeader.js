import P from 'prop-types'
import styles from './PageHeader.module.css'
import Dropdown from '@app/components/dropdown'
import { FaEllipsisH } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'

const DropdownData = [
  {
    label: 'Edit Profile',
    icon: <FiEdit2 />,
    function: () => alert('clicked')
  }
]

function PageHeader({ image, title, subtitle }) {
  return (
    <div className={styles.PageHeaderContainer}>
      <div className="flex items-center">
        <div className={styles.PageHeaderLogo}>
          <img alt="logo" src={image} />
        </div>

        <div className={styles.PageHeaderTitle}>
          <h1 className={styles.PageHeader}>{title || '---'}</h1>
          <h2 className={styles.PageHeaderSmall}>{subtitle || '---'}</h2>
        </div>
      </div>

      <div className={styles.PageButton}>
        <Dropdown label={<FaEllipsisH />} items={DropdownData} />
      </div>
    </div>
  )
}
PageHeader.propTypes = {
  image: P.string,
  title: P.string,
  subtitle: P.string
}
export default PageHeader
