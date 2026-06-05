const state = {
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  data: null,
  error: null,
};

export function getState() {
  return state;
}

export function setState(updates) {
  Object.assign(state, updates);
}