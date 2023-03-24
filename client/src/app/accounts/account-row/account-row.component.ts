import { Component, Input } from '@angular/core';
import { AccountsService, Transaction } from '../accounts.service';

@Component({
  selector: 'app-account-row',
  templateUrl: './account-row.component.html',
  providers: [ AccountsService ],
  styleUrls: ['./account-row.component.scss']
})
export class AccountRowComponent {
  @Input() id: number;
  @Input() transactiondate: string;
  @Input() accountnumber: number;
  @Input() description: string;
  @Input() vendor: string;
  @Input() category: string;
  @Input() transactiontype: number;
  @Input() fromaccount: string;
  @Input() toaccount: string;

  constructor() {}

}
