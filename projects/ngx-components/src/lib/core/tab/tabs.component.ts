import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { SelectableButtonComponent } from '../selectable-button/selectable-button.component';

@Component({
  selector: 'maxterdev-tabs',
  standalone: true,
  imports: [CommonModule, TabComponent, SelectableButtonComponent],
  templateUrl: './tabs.component.html',
  styleUrls: []
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  @Output() tabChange = new EventEmitter<TabComponent>();

  ngAfterContentInit() {
    // Deactivate all tabs first to handle pre-set active states correctly
    this.tabs.forEach(tab => tab.active = false);
    
    // Find any tab that was marked as active in the HTML
    const activeTab = this.tabs.find(tab => tab.active);

    // If an active tab is found and it's not disabled, select it. Otherwise, select the first non-disabled tab.
    if (activeTab && !activeTab.disabled) {
      this.selectTab(activeTab);
    } else {
      this.selectTab(this.tabs.find(tab => !tab.disabled));
    }
  }

  selectTab(tab: TabComponent | undefined): void {
    if (!tab || tab.active || tab.disabled) {
      return;
    }

    this.tabs.forEach(t => t.active = false);
    tab.active = true;
    this.tabChange.emit(tab);
  }
}