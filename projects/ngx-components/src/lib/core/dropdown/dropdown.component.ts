import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'maxterdev-dropdown',
  standalone: true,
  imports: [CommonModule, ListComponent],
  templateUrl: './dropdown.component.html',
  styleUrls: [],
})
export class DropdownComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() isMultiSelect: boolean = false;
  @Input() selectedOptions: any[] = [];
  @Output() selectedOptionsChange = new EventEmitter<any[]>();

  protected isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  handleSelectedItemsChange(items: any[]) {
    this.selectedOptions = items;
    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  handleSingleSelect(item: any) {
    this.selectOption(item);
  }

  selectOption(option: any) {
    if (!this.isMultiSelect) {
      this.selectedOptions = [option];
      this.selectedOptionsChange.emit(this.selectedOptions);
      this.isOpen = false;
    }
  }

  getSelectedOptionText(): string {
    if (this.selectedOptions.length) {
      return this.selectedOptions.map((option) => option.data).join(', ');
    }
    return this.placeholder;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!event.target || !(event.target as HTMLElement).closest('maxterdev-dropdown')) {
      this.isOpen = false;
    }
  }
}
