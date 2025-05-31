import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as authReducer } from "./reducer";
import thunk from "redux-thunk";

// Combine Reducers
const rootReducer = combineReducers({
  authReducer, // This will combine the authReducer
});

// Create Store with middleware
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
