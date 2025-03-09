import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { ListNode } from '../list/list.interface';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'maxterdev-dropdown',
  standalone: true,
  imports: [CommonModule, ListComponent],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() options: ListNode[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() isMultiSelect: boolean = false;
  @Input() selectedOptions: ListNode[] = [];
  @Output() selectedOptionsChange = new EventEmitter<ListNode[]>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  handleSelectedItemsChange(items: ListNode[]) {
    this.selectedOptions = items;
    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  handleSingleSelect(item: ListNode) {
    this.selectOption(item);
  }

  selectOption(option: ListNode) {
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
    if (!event.target || !(event.target as HTMLElement).closest('.dropdown')) {
      this.isOpen = false;
    }
  }
}
