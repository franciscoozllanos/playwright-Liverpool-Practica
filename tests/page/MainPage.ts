import {Page, Locator, expect} from "@playwright/test";

export class MainPage {
    readonly page: Page;
    readonly searchBar: Locator;
    readonly titlePoduct: Locator;
    readonly clickFilterColor: Locator;
    readonly sortByPrice: Locator;
    readonly sortByPriceOption: Locator;
    readonly firstFiveResults: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titlePoduct = page.getByTestId('plp-page-heading-title-title');
        this.searchBar = page.getByPlaceholder(/Buscar por producto/).filter({ visible: true });
        this.clickFilterColor = page.getByRole('checkbox', { name: /Blanco/ });
        this.sortByPrice = page.getByTestId('dropdown-sorting-button');
        this.sortByPriceOption = page.getByRole('option', { name: /Menor precio/ });
        this.firstFiveResults = page.getByText('HomePlaystation 5 artí').first();
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
        await expect(this.sortByPrice).toBeVisible();
        await this.sortByPriceOption.click();
}
    async getFirstFiveResults() {
        const results = await this.firstFiveResults.allTextContents();
        return results.slice(0, 5);
    }
 
}