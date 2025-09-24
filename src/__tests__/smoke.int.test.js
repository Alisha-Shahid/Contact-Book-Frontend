import { render, screen } from '@testing-library/react';
import React from 'react';

// Lightweight mocks to avoid ESM/router complexity in Jest
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ children, ...rest }) => React.createElement('a', { ...rest }, children),
    useNavigate: () => () => {},
  };
});

jest.mock('axios', () => ({ __esModule: true, default: { create: () => ({
  post: jest.fn(), get: jest.fn(), put: jest.fn(), delete: jest.fn(),
  interceptors: { request: { use: () => {} } },
}) }}));

import { AuthProvider } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm';

describe('Smoke Integration', () => {
  test('renders RegisterForm inputs', () => {
    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });
});


