import { Component, ContentChild, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'maxterdev-list',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() isMultiSelect: boolean = false;
  @Input() selectedItems: any[] = [];
  @Output() selectedItemsChange = new EventEmitter<any[]>();
  @Output() itemSelected = new EventEmitter<any>();

  @Input() inputItemTemplate?: TemplateRef<any>;
  @ContentChild(TemplateRef) contentItemTemplate?: TemplateRef<any>;

  activeItem: any = null;

  get itemTemplate(): TemplateRef<any> | null {
    return this.inputItemTemplate || this.contentItemTemplate || null;
  }

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
