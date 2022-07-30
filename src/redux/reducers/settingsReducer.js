import {mapBgToFg} from '../../util/themeUtils';

const InitialState = {
  bg: '#fafafa',
  fg: '#000000',
  size: '18px',
  height: 'normal',
};

export default function (state = InitialState, action) {
  switch (action.type) {
    case 'modify_settings':
      if (action.payload.bg) {
        return {...state, ...action.payload, fg: mapBgToFg(action.payload.bg)};
      }
      return {...state, ...action.payload};
    default:
      return state;
  }
}
