import React, { useRef } from 'react'

export const USER_TIMER = 'USER_TIMER'
export const CHECK_IN = 'CHECK_IN_USER'

const initialState = {
    userTimer: useRef(null),
    checkInUser: false
}

const TimerAndCheckInUser = (state = initialState, action) => {
    switch (action.type) {
        case USER_TIMER:
            return {
                ...state,
                userTimer: action.payload,
            }
        case CHECK_IN:
            return {
                ...state,
                checkInUser: action.payload,
            }
        default:
            return state
    }
}

export default TimerAndCheckInUser