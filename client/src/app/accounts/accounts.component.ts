import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { AccountsService, Transactions, Transaction } from './accounts.service';

/**
 * Account tree data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface AccountNode {
  name: string;
  children?: AccountNode[];
}

const TREE_DATA: AccountNode[] = [
  {
    name: 'Assets',
    children: [
      {
        name: 'Discretionary Assets', children: [
          { 
            name: 'Crypto', children: [
              { name: 'Bitcoin' },
              { name : 'Loopring'},
              { name : 'Ethereum'}
            ]
          },
          { 
            name: 'Liquid Accounts', children: [
              { name: 'Chase Checking'},
              { name: 'Tinker Federal Credit Union'},
              { name: 'Ally HYSA'}
            ]
          },
          {
            name: 'Semi-Liquid Accounts', children: [
              { name: 'U.S. Treasury'},
              { name: 'Schwab Discretionary'},
              { name: 'Vanguard Discretionary'}
            ]
          }
        ]
      },
      { 
        name: 'Fixed Assets', children: [
          { name: 'Honda Civic' }
        ]
      },
      {
        name: 'Retirement Assets', children: [
          { name: 'Fidelity 401k' },
          { name: 'Vanguard Roth IRA' }
        ]
      }
    ]
  },
  {
    name: 'Liabilities',
    children: [
      {
        name: 'Revolving Credit',
        children: [
          { name: 'Chase Amazon' },
          { name: 'Chase Freedom' },
          { name: 'Chase Basic' }
        ]
      },
      {
        name: 'Loans', children: [ 
          { name: 'Student Loans' } 
        ]
      }
    ]
  }
];

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-accounts',
  templateUrl: 'accounts.component.html',
  providers: [ AccountsService ],
  styleUrls: ['accounts.component.scss'],
})

export class AccountsComponent {
  treeControl = new NestedTreeControl<AccountNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<AccountNode>();
  visibleAcct = 'none';

  constructor(private accountsService: AccountsService) {
    this.dataSource.data = TREE_DATA;
    this.accountsService = accountsService
  }

  hasChild = (_: number, node: AccountNode) => !!node.children && node.children.length > 0;

  showAccount(acctName: string) {
    this.visibleAcct = acctName;
    console.log('Node clicked is ' + acctName);
    this.accountsService.getTransactions()
      .subscribe({
        next: (data: Transactions) => console.log(data.Ok.results[0].accountnumber), // success path
        error: error => console.log('uhoh'), // error path
      });
  }
}