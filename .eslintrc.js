module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: ['plugin:ember/base'],
  env: {
    browser: true,
    jquery: true,
    embertest: true,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-irregular-whitespace': 'off',
    'no-debugger': 'error',
    'require-yield': 'off',
    curly: 'error',
    'no-prototype-builtins': 'warn',
    'ember/alias-model-in-controller': 'off', //off
    'ember/avoid-leaking-state-in-components': 'off', //off
    'ember/avoid-leaking-state-in-ember-objects': 'error', //error
    'ember/avoid-using-needs-in-controllers': 'error', //error
    'ember/closure-actions': 'error', //error
    'ember/computed-property-getters': 'off', //off
    'ember/jquery-ember-run': 'error', //error
    'ember/local-modules': 'off', //off
    'ember/named-functions-in-promises': 'off', //off
    'ember/new-module-imports': 'error', //error
    'ember/no-attrs-in-components': 'error', //error
    'ember/no-attrs-snapshot': 'error', //error
    'ember/no-capital-letters-in-routes': 'error', //error
    'ember/no-deeply-nested-dependent-keys-with-each': 'off', //off
    'ember/no-duplicate-dependent-keys': 'error', //error
    'ember/no-ember-super-in-es-classes': 'off', //off
    'ember/no-ember-testing-in-module-scope': 'error', //error
    'ember/no-empty-attrs': 'off', //off
    'ember/no-function-prototype-extensions': 'error', //error
    'ember/no-get-properties': 'off', //off
    'ember/no-get': 'off', //off
    'ember/no-global-jquery': 'error', //error
    'ember/no-invalid-debug-function-arguments': 'off', //off
    'ember/no-jquery': 'off', //off
    'ember/no-new-mixins': 'off', //off
    'ember/no-observers': 'warn', //error
    'ember/no-old-shims': 'error', //error
    'ember/no-on-calls-in-components': 'error', //error
    'ember/no-restricted-resolver-tests': 'error', //error
    'ember/no-side-effects': 'error', //error
    'ember/no-test-and-then': 'off', //off
    'ember/no-test-import-export': 'off', //off
    'ember/no-unnecessary-index-route': 'off', //off
    'ember/no-unnecessary-route-path-option': 'off', //off
    'ember/no-unnecessary-service-injection-argument': 'off', //off
    'ember/order-in-components': 'off', //off
    'ember/order-in-controllers': 'off', //off
    'ember/order-in-models': 'off', //off
    'ember/order-in-routes': 'off', //off
    'ember/require-computed-macros': 'off', //off
    'ember/require-return-from-computed': 'off', //off
    'ember/route-path-style': 'off', //off
    'ember/routes-segments-snake-case': 'error', //error
    'ember/use-brace-expansion': 'error', //error
    'ember/use-ember-get-and-set': 'off', //off
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    }
  ]
};
