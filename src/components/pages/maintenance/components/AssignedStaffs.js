import P from 'prop-types'
import styles from '../maintenance.module.css'

function AssignedStaffs({ staffs, onClick }) {
  return (
    <div
      className={styles.AssignedStaffsContainer}
      role="button"
      onKeyDown={() => {}}
      tabIndex={0}
      onClick={onClick}
    >
      {staffs.map((staff, index) => {
        if (index <= 1) {
          return (
            <div
              key={staff?.user?._id}
              className={`${
                index === 0 ? 'border-primary-500' : 'border-white -ml-4'
              }`}
            >
              <div className={styles.avatarContainer}>
                <img
                  src={
                    staff.user?.avatar ||
                    `https://ui-avatars.com/api/?name=${staff.user.firstName}+${staff.user.lastName}&background=F5F6FA`
                  }
                  alt={staff.user.firstName}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>
          )
        }
        return null
      })}

      {staffs?.length > 2 ? (
        <div className={styles.countImageContainer}>{`${
          staffs.length - 2 > 0 ? '+' : ''
        }${staffs.length - 2}`}</div>
      ) : null}
    </div>
  )
}

AssignedStaffs.propTypes = {
  staffs: P.array.isRequired,
  onClick: P.func
}

export default AssignedStaffs
