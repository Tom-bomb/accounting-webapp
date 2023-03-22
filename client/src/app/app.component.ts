import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'C.P.TOM';
  visibleChild : string = 'performance';

  setVisible(newVis: string) {
    this.visibleChild = newVis;
    console.log('New visible child is ' + newVis);
  }
  appClick(arg: string) {
    console.log(arg);
  }
}
