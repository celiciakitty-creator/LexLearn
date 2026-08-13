let implPromise = null;

function useTestStore() {
  return process.env.NODE_ENV === 'test' && !process.env.SUPABASE_URL?.trim();
}

async function loadImpl() {
  if (!implPromise) {
    implPromise = useTestStore()
      ? import('./test-store.js')
      : import('./supabase-store.js');
  }
  return implPromise;
}

export function resetStoreImpl() {
  implPromise = null;
}

export async function authenticateDeveloper(apiKey) {
  const impl = await loadImpl();
  return impl.authenticateDeveloper(apiKey);
}

export async function registerApp(developerId, meta) {
  const impl = await loadImpl();
  return impl.registerApp(developerId, meta);
}

export async function getApp(app_id) {
  const impl = await loadImpl();
  return impl.getApp(app_id);
}

export async function isBlockedUser(user_id, student_handle) {
  const impl = await loadImpl();
  return impl.isBlockedUser(user_id, student_handle);
}

export async function recordEvent(app_id, payload) {
  const impl = await loadImpl();
  return impl.recordEvent(app_id, payload);
}

export async function getMetrics(app_id) {
  const impl = await loadImpl();
  return impl.getMetrics(app_id);
}

getMetrics.exportSnapshot = async function exportSnapshot() {
  const impl = await loadImpl();
  return impl.getMetrics.exportSnapshot();
};

export async function seedDefaults() {
  const impl = await loadImpl();
  return impl.seedDefaults();
}

export async function _resetForTests() {
  const impl = await loadImpl();
  return impl._resetForTests();
}

export async function _seedDeveloper(dev) {
  const impl = await loadImpl();
  return impl._seedDeveloper(dev);
}

export async function _blockUser(id) {
  const impl = await loadImpl();
  return impl._blockUser(id);
}
