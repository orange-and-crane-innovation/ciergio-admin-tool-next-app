import P from 'prop-types'
import styles from '../maintenance.module.css'

function AssignedStaffs({ staffs }) {
  return (
    <div className={styles.AssignedStaffsContainer}>
      {[...staffs.slice(0, 1)].map((staff, index) => (
        <div
          key={staff?.user?._id}
          className="w-full flex justify-start items-center"
        >
          <div className={styles.avatarContainer}>
            <img
              src={
                staff.user?.avatar ||
                `https://ui-avatars.com/api/?name=${staff.user.firstName}+${staff.user.lastName}&background=F5F6FA`
              }
              alt={staff.user.firstName}
              className={`${styles.avatarImage} ${
                index === 0 ? 'border-primary-500' : 'border-white -ml-4'
              }`}
            />
          </div>
        </div>
      ))}
      {staffs?.length > 2 ? (
        <div className={styles.countImageContainer}>{`${
          staffs.length - 2 > 0 ? '+' : ''
        }${staffs.length - 2}`}</div>
      ) : null}
    </div>
  )
}

AssignedStaffs.propTypes = {
  staffs: P.array.isRequired
}

export default AssignedStaffs
