import { Component, ContentChild, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ListNode } from './list.interface';

@Component({
  selector: 'maxterdev-list',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() items: ListNode[] = [];
  @Input() isMultiSelect: boolean = false;
  @Input() selectedItems: ListNode[] = [];
  @Output() selectedItemsChange = new EventEmitter<ListNode[]>();
  @Output() itemSelected = new EventEmitter<ListNode>();

  // Use ContentChild if no explicit template is provided, otherwise use the input.
  @Input() inputItemTemplate?: TemplateRef<any>;
  @ContentChild(TemplateRef) contentItemTemplate!: TemplateRef<any>;

  // Helper to get the template (priority: input > projected)
  protected get itemTemplate(): TemplateRef<any> {
    return this.inputItemTemplate || this.contentItemTemplate;
  }

  toggleItem(item: ListNode, selected: boolean) {
    this.setItemState(item, selected);
    this.updateParentState(this.items); // Check and update all parent nodes
    this.selectedItemsChange.emit(this.selectedItems);
  }

  private setItemState(item: ListNode, selected: boolean) {
    // Update the current item's state
    item.selected = selected;

    // Add or remove from selected items list
    if (selected) {
      if (!this.selectedItems.includes(item)) {
        this.selectedItems.push(item);
      }
    } else {
      const index = this.selectedItems.indexOf(item);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      }
    }

    // Propagate state to children
    if (item.children) {
      item.children.forEach((child) => this.setItemState(child, selected));
    }
  }

  private updateParentState(items: ListNode[]) {
    // Traverse all nodes to update parent states based on child states
    items.forEach((node) => {
      if (node.children) {
        const allChildrenSelected = node.children.every((child) => child.selected);

        // Update parent's `selected` state based on children
        node.selected = allChildrenSelected;
      }
    });
  }

  selectItem(item: ListNode) {
    if (!this.isMultiSelect) {
      this.itemSelected.emit(item);
    }
  }

  toggleExpand(item: ListNode) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  onNestedListChange(updatedItems: ListNode[]) {
    this.updateParentState(this.items); // Update parent state after nested changes
    this.selectedItemsChange.emit(updatedItems);
  }
}
