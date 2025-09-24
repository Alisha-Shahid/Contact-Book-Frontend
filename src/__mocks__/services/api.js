const contacts = [];
let token = null;

const apiMock = {
  post: jest.fn(async (url, body) => {
    if (url === '/auth/register') {
      token = 't-register';
      return { data: { token, user: { id: 'u1', email: body.email } } };
    }
    if (url === '/auth/login') {
      token = 't-login';
      return { data: { token, user: { id: 'u1', email: body.email } } };
    }
    if (url === '/contacts') {
      if (!token) throw new Error('unauthorized');
      const newContact = { _id: String(Date.now()), ...body };
      contacts.unshift(newContact);
      return { data: newContact };
    }
    throw new Error('unknown POST ' + url);
  }),
  get: jest.fn(async (url) => {
    if (!url.startsWith('/contacts')) throw new Error('unknown GET ' + url);
    const qsIndex = url.indexOf('?');
    let result = contacts;
    if (qsIndex >= 0) {
      const params = new URLSearchParams(url.substring(qsIndex + 1));
      const term = (params.get('search') || '').toLowerCase();
      if (term) {
        result = contacts.filter(c =>
          (c.name || '').toLowerCase().includes(term) ||
          (c.email || '').toLowerCase().includes(term) ||
          (c.phone || '').toLowerCase().includes(term)
        );
      }
    }
    return { data: result };
  }),
  put: jest.fn(async (url, body) => {
    const id = url.split('/').pop();
    const idx = contacts.findIndex(c => c._id === id);
    if (idx === -1) throw new Error('not found');
    contacts[idx] = { ...contacts[idx], ...body };
    return { data: contacts[idx] };
  }),
  delete: jest.fn(async (url) => {
    const id = url.split('/').pop();
    const remaining = contacts.filter(c => c._id !== id);
    contacts.length = 0;
    contacts.push(...remaining);
    return { data: { message: 'Deleted' } };
  }),
  interceptors: { request: { use: () => {} } },
};

module.exports = { __esModule: true, default: apiMock };


