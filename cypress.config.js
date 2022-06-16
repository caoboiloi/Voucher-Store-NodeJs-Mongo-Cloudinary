const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    supportFile: 'cypress/support/commands.js',
    baseUrl: 'https://pdvoucher.azurewebsites.net/',
  },
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  responseTimeout: 30000,
  requestTimeout: 30000,
  projectId: "56jv5t"
})
