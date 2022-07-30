export const addBook = (payload) => {
  return {type: 'add_book', payload};
};

export const saveBookProgress = (payload) => {
  return {type: 'save_book_progress', payload};
};

export const toggleCompletion = (payload) => {
  return {type: 'toggle_completion', payload};
};

export const deleteBook = (payload) => {
  return {type: 'delete_book', payload};
};

// previously in meta actions
export const turnOffOnboarding = (payload) => {
  return {type: 'turn_off_onboarding', payload};
};

export const turnOnOnboarding = (payload) => {
  return {type: 'turn_on_onboarding', payload};
};

export const setTargets = (payload) => {
  return {type: 'set_targets', payload};
};

export const resetTargets = (payload) => {
  return {type: 'reset_targets', payload};
};

export const updateDailyTimer = (payload) => {
  return {type: 'update_daily_timer', payload};
};

export const updatemonthlyBookCount = (payload) => {
  return {type: 'update_monthly_book_count', payload};
};

export const updateStats = (payload) => {
  return {type: 'update_stats', payload};
};

export const resetStats = (payload) => {
  return {type: 'reset_stats', payload};
};

export const markComplete = (payload) => {
  return {type: 'mark_complete', payload};
};

export const markIncomplete = (payload) => {
  return {type: 'mark_incomplete', payload};
};
