const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_LISTS':
        return { ...state, lists: action.payload }
      case "SET_COLORS":
        return { ...state, colors: action.payload }
      case "SET_ACTIVE_ITEM":
        return { ...state, activeItem: action.payload }
      default:
        return state
    }
}

export default reducer