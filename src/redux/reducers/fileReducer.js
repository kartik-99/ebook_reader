import {getDate, getCurrentMonth} from '../../util/stats';

const INITIAL_STATE = {
  newBookId: 0,
  loading: false,
  books: {},
  onboarded: false,
  lastUpdated: null,
  targets: {
    daily: null,
    monthly: null,
  },
  progress: {
    daily: {},
    monthly: {},
  },
};

const newBook = {
  author: '',
  bgcolor: '',
  coverPath: '',
  fileCopyUri: '',
  name: '',
  title: '',
  uri: '',
  contents: [],
  annotations: {highlights: []},
  pages: {locations: [], currentPage: null},
  loadDate: null,
  startDate: null,
  endDate: null,
  timelogs: [],
  totalTime: 0,
  useOld: false,
};

const fileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'add_book':
      var newState = JSON.parse(JSON.stringify(state));
      var book = {...newBook, ...action.payload};
      book.loadDate = new Date().valueOf();
      book.id = state.newBookId;

      // console.log('book being added : ', book);
      newState.books[state.newBookId] = book;
      newState.newBookId = state.newBookId + 1;
      return newState;

    case 'save_book_progress':
      var newState = JSON.parse(JSON.stringify(state));
      var id = action.payload.id;

      var book = JSON.parse(JSON.stringify(state.books[id]));
      book.annotations.highlights = action.payload.highlights;
      book.useOld = action.payload.useOld;
      if (action.payload.locations !== undefined) {
        book.pages = {
          locations: action.payload.locations,
          currentPage: action.payload.currentPage,
        };
        if (action.payload.currentPage === action.payload.locations.length) {
          book.endDate = new Date().valueOf();
        }
      }

      book.timelogs.push({
        start: action.payload.startTime,
        end: new Date().valueOf(),
      });
      if (book.startDate === null) {
        book.startDate = action.payload.startTime;
      }

      book.totalTime += new Date().valueOf() - action.payload.startTime;

      newState.books[id] = book;
      return newState;

    case 'toggle_completion':
      var newState = JSON.parse(JSON.stringify(state));
      var index = action.payload.id;
      var book = JSON.parse(JSON.stringify(newState.books[index]));
      if (book.endDate === null) {
        book.endDate = new Date().valueOf();
      } else {
        book.endDate = null;
      }

      newState.books[index] = book;
      return newState;

    case 'delete_book':
      var newState = JSON.parse(JSON.stringify(state));
      delete newState.books[action.payload.id];
      return newState;

    // Cases previously in meta reducer
    case 'turn_on_onboarding':
      var newState = state;
      return {...newState, onboarded: false};

    case 'turn_off_onboarding':
      var newState = state;
      return {...newState, onboarded: true};

    case 'set_targets':
      var newState = state;
      newState.onboarded = true;
      newState.targets = {
        daily: action.payload.daily,
        monthly: action.payload.monthly,
      };
      return newState;

    case 'reset_targets':
      var newState = state;
      newState.onboarded = false;
      newState.targets = {
        daily: null,
        monthly: null,
      };
      return newState;

    case 'update_daily_timer':
      if (action.payload.time > 5000) {
        var date = getDate();
        var newState = state;
        newState.progress.daily[date] === undefined ||
        newState.progress.daily[date] === null
          ? (newState.progress.daily[date] = action.payload.time)
          : (newState.progress.daily[date] += action.payload.time);
        return newState;
      } else {
        return state;
      }

    case 'update_monthly_book_count':
      var date = getCurrentMonth();
      var newState = state;
      newState.progress.monthly[date] === undefined ||
      newState.progress.monthly[date] === null
        ? (newState.progress.monthly[date] = 1)
        : (newState.progress.monthly[date] += 1);
      return newState;

    case 'update_stats':
      if (
        state.lastUpdated != null &&
        new Date().valueOf() - state.lastUpdated < 86400000
      )
        return state;

      var newState = state;
      if (newState.lastUpdated == null)
        state.lastUpdated = new Date().valueOf();

      let days = (new Date().valueOf() - state.lastUpdated) / 86400000;
      var date = '';
      for (let i = 0; i <= days; i++) {
        date = getDate(i);
        if (newState.progress.daily[date] === undefined)
          newState.progress.daily[date] = 0;
      }
      if (newState.progress.monthly[getCurrentMonth()] === undefined)
        newState.progress.monthly[getCurrentMonth()] = [];

      return newState;
    case 'reset_stats':
      var newState = state;
      newState.progress.daily = {};
      newState.progress.monthly = {};
      return newState;
    case 'mark_complete':
      var newState = state;
      var month = getCurrentMonth();
      if (month in newState.progress.monthly)
        newState.progress.monthly[month].push(action.payload.title);
      else newState.progress.monthly[month] = [action.payload.title];
      return newState;

    case 'mark_incomplete':
      var newState = state;
      for (var i in newState.progress.monthly) {
        let index = newState.progress.monthly[i].indexOf(action.payload.title);
        if (index !== -1) {
          newState.progress.monthly[i].splice(index, 1);
        }
      }
      return newState;
    default:
      return state;
  }
};
export default fileReducer;
