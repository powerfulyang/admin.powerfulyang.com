module.exports = {
  extends: [require.resolve('@powerfulyang/lint/dist/eslint')],
  globals: {
    API_ENV: true,
  },
  rules: {
    'react/react-in-jsx-scope': 0,
  },
};
