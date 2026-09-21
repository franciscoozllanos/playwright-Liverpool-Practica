import {Page, Locator, expect} from "@playwright/test";

export class MainPage {
    readonly page: Page;
    readonly searchBar: Locator;
    readonly titlePoduct: Locator;
    readonly clickFilterColor: Locator;
    readonly sortByPrice: Locator;
    readonly sortByPriceOption: Locator;
    readonly productCard: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.titlePoduct = page.getByTestId('plp-page-heading-title-title');
        this.searchBar = page.getByPlaceholder(/Buscar por producto/).filter({ visible: true });
        this.clickFilterColor = page.getByRole('checkbox', { name: /Blanco/ });
        this.sortByPrice = page.getByTestId('dropdown-sorting-button');
        this.sortByPriceOption = page.getByRole('option', { name: 'Menor precio', exact: true });
        this.productCard = page.locator('section[data-testid$="-card"]');
        
    }

    async goto() {
        await this.page.goto('https://www.liverpool.com.mx/tienda/home');

    }

    async searchForProduct(productName: string) {
        await this.searchBar.fill(productName);
        await this.searchBar.press('Enter');
        await this.titlePoduct.waitFor({ state: 'visible' });
        await this.sortByPrice.scrollIntoViewIfNeeded();
        await this.sortByPrice.click();
    }
    async selectCheckboxColor() {
        await this.clickFilterColor.scrollIntoViewIfNeeded();
        await this.clickFilterColor.click();
        await expect(this.clickFilterColor).toBeChecked();
}
    async OrderByPrice() {
        await this.sortByPrice.scrollIntoViewIfNeeded();
        await this.sortByPrice.click();
        await expect(this.sortByPriceOption).toBeVisible();
        await this.sortByPriceOption.click();
        await this.page.waitForTimeout(5000); // espera 2 segundos para que se apliquen los cambios de ordenamiento
}
    async getFirstProduct(cantidad = 5) {
  // 1. Filtrar solo las tarjetas visibles
  const cards = this.productCard.filter({ visible: true });

  // 2. Esperar a que al menos la primera tarjeta esté visible en el DOM (Playwright maneja el timeout automáticamente)
  await cards.first().waitFor({ state: 'visible' });

  const productos: { nombre: string; precio: string }[] = [];

  for (let i = 0; i < cantidad; i++) {
    const card = cards.nth(i);

    await card.scrollIntoViewIfNeeded();

    const nombreText = await card.locator('h3, h5, [class*="title"]').first().innerText();
    const precioText = await card.locator('[class*="price"], [data-testid*="price"]').first().innerText();

    productos.push({
      nombre: nombreText.trim(),
      precio: precioText.trim().replace(/\n/g, ' ')
    });
  }

  return productos;
}
 
}