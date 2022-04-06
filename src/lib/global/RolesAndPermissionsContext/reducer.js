const RolePermissionsReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING_ROLES_PERMISSIONS': {
      return {
        ...state,
        loading: true
      }
    }
    case 'LOADED_ROLES_PERMISSIONS': {
      const { payload } = action
      return {
        ...state,
        permissions: payload?.permissions,
        roles: payload?.roles,
        loading: false
      }
    }
    case 'FAILED_ROLES_PERMISSIONS': {
      return {
        ...state,
        loading: false,
        error: true
      }
    }
  }
}

export default RolePermissionsReducer
