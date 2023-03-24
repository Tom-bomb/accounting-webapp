import { Input, Component } from '@angular/core';
import { AccountRowComponent } from '../account-row/account-row.component';
import { AccountsService, Transactions, Transaction } from '../accounts.service';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  providers: [ AccountsService ],
  styleUrls: ['./account-table.component.scss']
})



export class AccountTableComponent {
  @Input() showTable = false;


  constructor(private accountsService: AccountsService) {
    this.accountsService = accountsService;
  }

  ngOnInit() {
    this.accountsService.getTransactions()
    .subscribe({
      next: (data: Transactions) => {
        data.Ok.results.forEach(transact => {
          const tmp = transact as Transaction;
          this.rows.push(tmp);
          console.log("I pushed something");
          console.log(typeof tmp);
          
          console.log(tmp.category);
        });
        // console.log(data.Ok.results[0].accountnumber); // success path


      },
      error: error => console.log('uhoh'), // error path
    });
  }
  rows: AccountRowComponent[] = [];
  headers: String[] = [ "id", "Transaction Date", "Account Number", "Description","Vendor", "Category", "Transaction Type",
    "fromaccount", "toaccount"]
}
