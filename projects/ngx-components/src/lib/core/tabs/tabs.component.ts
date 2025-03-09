import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  activeTab: number = 0; // Tracks the currently active tab

  setActiveTab(index: number): void {
    this.activeTab = index;
  }
}
