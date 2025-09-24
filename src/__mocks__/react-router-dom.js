const React = require('react');

module.exports = {
  BrowserRouter: ({ children }) => React.createElement('div', null, children),
  Routes: ({ children }) => React.createElement(React.Fragment, null, children),
  Route: ({ element }) => React.createElement(React.Fragment, null, element),
  Link: ({ children, to, ...rest }) => React.createElement('a', { href: to, ...rest }, children),
  Navigate: ({ to }) => React.createElement('div', null, `Navigate to ${to}`),
  useNavigate: () => () => {},
};


