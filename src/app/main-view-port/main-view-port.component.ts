import { Input, Component } from '@angular/core';

@Component({
  selector: 'app-main-view-port',
  templateUrl: './main-view-port.component.html',
  styleUrls: ['./main-view-port.component.scss']
})
export class MainViewPortComponent {
  // @Input() showPerformance = false;
  @Input() whoIsVisible = 'performance';
}
