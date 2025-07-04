import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "staticDirs": [{ from: '../src/assets', to: '/assets' }],
  "framework": {
    "name": "@storybook/angular",
    "options": {}
  }
};
export default config;