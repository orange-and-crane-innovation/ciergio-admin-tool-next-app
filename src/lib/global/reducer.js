const Reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_UNREAD_MSG': {
      console.log('UPDATE_UNREAD_MSG', state, action)
      return {
        ...state,
        unreadMsg: action.payload
      }
    }
    default:
      return state
  }
}

export default Reducer
