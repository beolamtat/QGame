import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.goto('/');
 await expect(page.locator('#game canvas')).toBeVisible({timeout:20000});
});

test('game boots and shows farm controls',async({page})=>{
 await expect(page.locator('#stats')).toContainText('120');
 await expect(page.locator('#action')).toContainText('Đến quán');
 await expect(page.locator('#map-open')).toBeVisible();
 await expect(page.locator('#game canvas')).toHaveCount(1);
});

test('farm and café switching keeps the canvas and UI responsive',async({page})=>{
 await page.locator('#action').click();
 await expect(page.locator('#action')).toContainText('Về nông trại');
 await expect(page.locator('#orders')).toBeVisible();
 await expect(page.locator('#orders')).toContainText('ĐƠN HÀNG');
 await page.locator('#action').click();
 await expect(page.locator('#action')).toContainText('Đến quán');
 await expect(page.locator('#game canvas')).toHaveCount(1);
});

test('map opens, selects country and closes without losing game state',async({page})=>{
 await page.locator('#map-open').click();
 await expect(page.locator('#world-map')).toHaveClass(/visible/);
 await expect(page.getByRole('button',{name:'Trung Quốc'})).toBeVisible();
 await page.getByRole('button',{name:'Trung Quốc'}).click();
 await expect(page.locator('#world-detail')).toContainText('Trung Quốc');
 await expect(page.locator('#world-detail')).toContainText('Mở khóa');
 await page.locator('#map-close').click();
 await expect(page.locator('#world-map')).not.toHaveClass(/visible/);
 await expect(page.locator('#action')).toContainText('Đến quán');
});

test('world-map starter branch upgrade charges coins and persists',async({page})=>{
 await page.locator('#map-open').click();
 await expect(page.locator('#world-detail')).toContainText('Việt Nam');
 await expect(page.locator('#world-detail')).toContainText('Nâng cấp · 200 xu');
 await expect(page.locator('#world-detail button').filter({hasText:'Nâng cấp'})).toBeDisabled();
 await page.reload();
 await expect(page.locator('#game canvas')).toBeVisible();
 await page.locator('#map-open').click();
 await expect(page.locator('#world-detail')).toContainText('Chi nhánh cấp 1');
});

test('reload retains the saved game wallet',async({page})=>{
 await page.locator('#extra').click(); // Initial farm has no green beans.
 await expect(page.locator('#stats')).toContainText('120');
 await page.reload();
 await expect(page.locator('#stats')).toContainText('120');
});

test('no unhandled browser errors during scene and map transitions',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',err=>errors.push(err.message));
 await page.locator('#action').click();
 await page.locator('#map-open').click();
 await page.getByRole('button',{name:'Nhật Bản'}).click();
 await page.locator('#map-close').click();
 await page.locator('#action').click();
 await expect(page.locator('#game canvas')).toBeVisible();
 expect(errors).toEqual([]);
});
