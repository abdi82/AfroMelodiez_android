import { createStore, applyMiddleware } from "redux";
import reducer, { initialState } from "../reducer/reducer";

const store = createStore(reducer);

export default store;