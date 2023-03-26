import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Transaction {
  id: number;
  transactiondate: string;
  accountnumber: number;
  description: string;
  vendor: string;
  category: string;
  transactiontype: number;
  fromaccount: string;
  toaccount: string;
}

export interface Transactions {
  Ok: {
    results: [Transaction]
  }
}

@Injectable()
export class AccountsService {
  accountsUrl = 'http://192.168.0.179:9090';

  constructor(private http: HttpClient) { }

  getTransactions() {
    return this.http.get<Transactions>(this.accountsUrl + '/derp/tomithy')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  doPlaid() {
    return this.http.get(this.accountsUrl + '/do/plaid')
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  getTransactionsResponse(): Observable<HttpResponse<Transactions>> {
    return this.http.get<Transactions>(
      this.accountsUrl, { observe: 'response' });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  makeIntentionalError() {
    return this.http.get('not/a/real/url')
      .pipe(
        catchError(this.handleError)
      );
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/