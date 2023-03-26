import { Component, ViewChildren, QueryList, HostListener, ElementRef, Renderer2, ViewChild, Query} from '@angular/core';
import { AccountsService, Transactions, Transaction } from '../accounts.service';


@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  providers: [ AccountsService ],
  styleUrls: ['./account-table.component.scss']
})



export class AccountTableComponent {
  @ViewChildren('header') headers: QueryList<ElementRef>;
  @ViewChild('resizeMeh') table: ElementRef;
  rows: Transaction[] = [];
  headerDict: Map<string, ElementRef> = new Map<string, ElementRef>();
  globalInstance: any;

  constructor(private accountsService: AccountsService, private rd: Renderer2) {
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
          
          console.log(tmp.category);
        });
        // console.log(data.Ok.results[0].accountnumber); // success path


      },
      error: error => console.log('uhoh'), // error path
    });
  }

  ngAfterViewInit() {

    this.headers.forEach(item => {

      this.headerDict.set(item.nativeElement.innerText, item);
      this.globalInstance = this.rd.listen(item.nativeElement, 'mousedown', (e: MouseEvent) => {

        let x = e.clientX;
        let w = 0;

        let styles = window.getComputedStyle(item.nativeElement);
        w = parseInt(styles.width, 10);

        let moveUnlistener = this.rd.listen(window, 'mousemove', (e: MouseEvent) => {
          const dx = e.clientX - x;
          let tmp = w + dx;
          item.nativeElement.style.width = `${w + dx}px`;
        });

        let upUnlistener = this.rd.listen(window, 'mouseup', (e: MouseEvent) => {
          moveUnlistener();
          upUnlistener();
        });
      });
    });
}
 doClickStuff(header: string, e: Event) {

    console.log('I seen a click at ' + header);
    console.log(e);
}

    
}
