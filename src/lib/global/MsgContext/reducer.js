const Reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_UNREAD_MSG': {
      return {
        ...state,
        unreadMsg: action.payload
      }
    }
    case 'UPDATE_NEW_MSG': {
      return {
        ...state,
        newMsg: action.payload
      }
    }
    default:
      return state
  }
}

export default Reducer
