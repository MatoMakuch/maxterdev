import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'maxterdev-table',
  standalone: true,
  imports: [CommonModule, ListComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: { key: string; label: string }[] = []; 
  @Input() items: any[] = []; 
  @Input() isMultiSelect: boolean = false; 
  @Input() selectedItems: any[] = []; 
  @Output() selectedItemsChange = new EventEmitter<any[]>(); 
  @Output() rowClicked = new EventEmitter<any>(); 

  trackByFn(index: number, item: any): any {
    return item.id || index; 
  }

  onRowSelected(item: any) {
    this.rowClicked.emit(item);
  }
}
