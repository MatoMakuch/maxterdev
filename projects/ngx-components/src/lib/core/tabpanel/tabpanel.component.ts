import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabpanel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabpanel.component.html',
  styleUrls: ['./tabpanel.component.scss']
})
export class TabPanelComponent {
  @Input() active: boolean = false; 
}
