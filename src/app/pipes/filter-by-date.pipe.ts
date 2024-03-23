import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByDate',
})
export class FilterByDatePipe implements PipeTransform {
  transform(transactions: any[], filterDate: string): any[] {
    return transactions.filter(
      (transaction) => transaction.date === filterDate
    );
  }
}
