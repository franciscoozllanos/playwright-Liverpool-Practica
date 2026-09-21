import {expect, test} from '@playwright/test';
import {MainPage} from '../page/MainPage';


test.describe('Search in main page a product', () =>{
    let mainPage: MainPage;
    test.beforeEach(async ({page}) => {
        mainPage = new MainPage(page);
        await mainPage.goto();
    });
    test('Enter the text into the search field and validate the result', async ({page}) => {
        await mainPage.searchForProduct('Play Station 5');
        await mainPage.selectCheckboxColor();
        await mainPage.OrderByPrice();
             const productos = await mainPage.getFirstProduct(5);
        console.table(productos);

        expect(productos).toHaveLength(5);
        for (const p of productos) {
            expect(p.nombre).not.toBe('');
            expect(p.precio).toMatch(/\$\s?[\d,]+/); // Validar que el precio tenga el formato correcto
        }
    });
});
