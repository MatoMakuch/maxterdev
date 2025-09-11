import { Component, ContentChild, Input, TemplateRef, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'maxterdev-list',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() isMultiSelect: boolean = false;
  @Input() selectedItems: any[] = [];
  @Input() size: 'md' | 'sm' = 'md';
  @Output() selectedItemsChange = new EventEmitter<any[]>();
  @Output() itemSelected = new EventEmitter<any>();

  @Input() itemTemplate?: TemplateRef<any>;
  
  @HostBinding('class') get sizeClass() {
    return this.size;
  }

  @ContentChild('item', { read: TemplateRef }) itemContentChild?: TemplateRef<any>;

  get item(): TemplateRef<any> | null {
    return this.itemTemplate || this.itemContentChild || null;
  }

  activeItem: any = null;

  toggleItem(item: any, checked: boolean): void {
    if (checked) {
      if (!this.selectedItems.includes(item)) {
        this.selectedItems.push(item);
      }
    } else {
      const index = this.selectedItems.indexOf(item);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      }
    }
    this.selectedItemsChange.emit(this.selectedItems);
  }

  selectItem(item: any): void {
    if (!this.isMultiSelect) {
      this.selectedItems = [item];
      this.itemSelected.emit(item);
    }
  }

  setActive(item: any): void {
    this.activeItem = item;
  }

  clearActive(): void {
    this.activeItem = null;
  }
}
