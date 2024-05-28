// src/reducers/counterReducer.ts

// Define action types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const ADD_JOB_APPLICATION = 'ADD_JOB_APPLICATION'


// Define action creators
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

export const jobapplication = (jobApplication: any) => ({
    type: ADD_JOB_APPLICATION,
    payload: jobApplication,
  });

// Define initial state
const initialState = {
    count: 0,
    jobs: []
};

// Define reducer function
const jobReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                count: state.count + 1,
            };
        case DECREMENT:
            return {
                ...state,
                count: state.count - 1,
            };
        case ADD_JOB_APPLICATION:
            return {
                ...state,
                jobs: [...state.jobs, action.payload], // Add new job application
            };
        default:
            return state;
    }
};

export default jobReducer;
