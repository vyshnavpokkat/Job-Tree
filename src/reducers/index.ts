// src/reducers/index.ts

import { combineReducers } from 'redux';
import jobReducer from './jobReducer';


const rootReducer = combineReducers({
  job: jobReducer, // Add your individual reducers here
});

export default rootReducer;
