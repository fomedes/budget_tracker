import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uniqueCurrency' })
export class UniqueCurrencyPipe implements PipeTransform {
  transform(countries: any[]): any[] {
    // Create a Set that sorts elements by currency name and removes duplicates
    const uniqueCurrencies = countries
      .map(({ currency }) => currency)
      .filter(
        (currency, index, self) =>
          self.findIndex((c) => c.code === currency.code) === index
      )
      .sort((a, b) => a.code.localeCompare(b.code));

    // Convert the Set back to an array
    return Array.from(uniqueCurrencies);
  }
}
