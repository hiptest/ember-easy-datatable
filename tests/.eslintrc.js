module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    embertest: true,
  },
  globals: {
    document: true,
    window: true,
    location: true,
    setTimeout: true,
    $: true,
    Promise: true,
    define: true,
    console: true,
  },
}
