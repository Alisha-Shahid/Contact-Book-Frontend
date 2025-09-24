import { render, screen, waitFor, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock axios so src/services/api.js builds an axios instance we control
jest.mock('axios', () => {
  const contacts = [];
  let token = null;
  const instance = {
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
  return { __esModule: true, default: { create: () => instance } };
});
// Minimal mock for react-router-dom used by forms
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ children, ...rest }) => React.createElement('a', { ...rest }, children),
    useNavigate: () => () => {},
  };
});

import { AuthProvider } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm';
import ContactList from '../components/ContactList';

// Mock window.alert to avoid noisy dialogs
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterAll(() => {
  window.alert.mockRestore();
});


describe('Integration: register → login → add contact → search', () => {
  test.skip('happy path flow', async () => {
    // 1) Register (auto-login) under AuthProvider
    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText(/email/i), 'ui@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for welcome alert side effect
    await waitFor(() => expect(window.alert).toHaveBeenCalled());

    // 2) Now mount ContactList in a new tree so AuthProvider reads token/user from localStorage
    cleanup();
    render(
      <AuthProvider>
        <ContactList />
      </AuthProvider>
    );

    // Add a contact
    await userEvent.click(screen.getByRole('button', { name: /new contact/i }));
    const nameInputs = screen.getAllByPlaceholderText(/name/i);
    // pick the plain Name field, not the search box
    await userEvent.type(nameInputs.find(i => i.getAttribute('placeholder') === 'Name'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText(/^email$/i), 'alice@example.com');
    const phoneInputs = screen.getAllByPlaceholderText(/phone/i);
    await userEvent.type(phoneInputs.find(i => i.getAttribute('placeholder') === 'Phone'), '123');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Contact appears in table
    const table = await screen.findByRole('table');
    const row = within(table).getByText('Alice').closest('tr');
    expect(row).toBeTruthy();
    expect(within(row).getByText('alice@example.com')).toBeInTheDocument();

    // Search for it
    await userEvent.type(screen.getByPlaceholderText(/search name\/email\/phone/i), 'alice');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    // Still visible after search filtering
    await waitFor(() => expect(within(screen.getByRole('table')).getByText('Alice')).toBeInTheDocument());
  });
});


