import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-tablist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tablist.component.html',
  styleUrls: ['./tablist.component.scss']
})
export class TabListComponent {
  @Input() tabs: string[] = []; // Array of tab headers
  @Input() activeTab: number = 0; // Currently active tab index
  @Output() tabChange = new EventEmitter<number>(); // Emit the active tab index

  selectTab(index: number): void {
    this.tabChange.emit(index);
  }
}
