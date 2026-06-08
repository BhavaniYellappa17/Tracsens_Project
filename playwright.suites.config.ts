import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,

  workers: 1,
  fullyParallel: false,

  projects: [
    {
      name: '1 - Login',
      testMatch: '**/NegativeLogin.spec.ts',
    },
    {
      name: '2 - Home Page',
      testMatch: '**/homePage.spec.ts',
    },
    {
      name: '3 - Administration',
      testMatch: '**/administration.spec.ts',
    },
    {
      name: '4 - Outlet Management',
      testMatch: '**/outletManagement.spec.ts',
    },
    {
      name: '5 - Audit Management',
      testMatch: '**/auditManagement.spec.ts',
    },
    {
      name: '6 - Product Management',
      testMatch: '**/productManagement.spec.ts',
    },
  ],
});