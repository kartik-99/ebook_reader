import {combineReducers} from 'redux';
import fileReducer from './fileReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
  files: fileReducer,
  settings: settingsReducer,
});
