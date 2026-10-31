import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',
 timeout:30_000,
 expect:{timeout:10_000},
 fullyParallel:true,
 retries:process.env.CI?1:0,
 reporter:process.env.CI?[['list'],['html',{open:'never'}]]:'list',
 use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[
  {name:'chromium-desktop',use:{...devices['Desktop Chrome']}},
  {name:'chromium-mobile',use:{...devices['Pixel 7']}},
  {name:'webkit-mobile',use:{...devices['iPhone 13']}}
 ],
 webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:60_000}
});
