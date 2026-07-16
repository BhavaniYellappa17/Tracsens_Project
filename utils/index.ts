// Core Playwright testing utilities
export { test, expect } from '@playwright/test';

// Side-effect import: registers global hooks (login/logout etc.)
import '../hooks/hooks';

// Node built-in
export { default as path } from 'path';

//Login
export { LoginPage } from '../pages/Tracsens/loginPage';
export { default as loginData } from '../tests/testdata/loginData.json';

// Page Object Models — Home & Administration
export { Home_Page } from '../pages/Tracsens/homePage';
export { adminCustomerPage } from '../pages/Tracsens/adminCustomerPage';
export { adminUserPage } from '../pages/Tracsens/adminUserPage';

// Page Object Models — Outlet Management
export { OutletMenuNav } from '../pages/outletMenuNavigation';
export { AllOutletNames } from '../pages/Tracsens/getOutletMng_OutletNames';
export { OutletPage } from '../pages/Tracsens/searchOutletNames';
export { AuditPage } from '../pages/Tracsens/outletMng_AuditPage';
export { DashboardPage } from '../pages/Tracsens/outletMng_DashboardPage';
export { OutletInformationPage } from '../pages/Tracsens/outletMng_outletInformationPage';

// Test data
export { default as adminData } from '../tests/testdata/adminData.json';