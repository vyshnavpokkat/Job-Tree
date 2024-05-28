// store.ts

import { createStore } from 'redux';
import rootReducer from '../reducers'; // Import your root reducer

const store = createStore(rootReducer); // Create the Redux store with your root reducer

export default store;
