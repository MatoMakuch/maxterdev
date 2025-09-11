import {
  Component, Input, Output, EventEmitter, ContentChildren, QueryList,
  HostBinding, ChangeDetectionStrategy, SimpleChanges, OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ColumnComponent } from '../table/column.component';
import { ColumnBodyTemplateDirective, ColumnHeaderTemplateDirective } from '../../directives/table-column.directive';
import { TreeNode } from './tree-node.interface';

// Per-node runtime state (kept out of input data)
type NodeMeta = {
  level: number;
  expanded: boolean;
  selected: boolean;
  indeterminate: boolean;
  parent?: TreeNode;
};

@Component({
  selector: 'maxterdev-treetable',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxComponent,
    ColumnComponent,
    ColumnHeaderTemplateDirective,
    ColumnBodyTemplateDirective
  ],
  templateUrl: './tree.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeTableComponent implements OnChanges {
  @Input() data: ReadonlyArray<TreeNode> = [];
  @Input() isMultiSelect = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() selectionChange = new EventEmitter<ReadonlyArray<TreeNode>>();

  @ContentChildren(ColumnComponent, { descendants: true }) columns!: QueryList<ColumnComponent>;

  // host classes
  @HostBinding('class.maxterdev-treetable') base = true;
  @HostBinding('class.size-sm') get isSm() { return this.size === 'sm'; }
  @HostBinding('class.size-md') get isMd() { return this.size === 'md'; }
  @HostBinding('class.size-lg') get isLg() { return this.size === 'lg'; }

  /** Flat list of nodes to render (respecting expansion) */
  public flattenedData: ReadonlyArray<TreeNode> = [];

  /** Per-node metadata without mutating inputs */
  private meta = new WeakMap<TreeNode, NodeMeta>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.rebuildMetaAndFlatten();
    }
  }

  // -------- meta helpers ----------
  private getMeta(node: TreeNode): NodeMeta {
    let m = this.meta.get(node);
    if (!m) {
      m = {
        level: 0,
        expanded: !!node.expanded,
        selected: !!node.selected,
        indeterminate: !!node.indeterminate,
      };
      this.meta.set(node, m);
    }
    return m;
    }
  level(node: TreeNode): number { return this.getMeta(node).level; }
  isExpanded(node: TreeNode): boolean { return this.getMeta(node).expanded; }
  isSelected(node: TreeNode): boolean { return this.getMeta(node).selected; }
  isIndeterminate(node: TreeNode): boolean { return this.getMeta(node).indeterminate; }
  parent(node: TreeNode): TreeNode | undefined { return this.getMeta(node).parent; }

  // Preserve expanded/selected state across rebuilds
  private rebuildMetaAndFlatten(): void {
    const nextMeta = new WeakMap<TreeNode, NodeMeta>();

    const setMeta = (nodes: ReadonlyArray<TreeNode>, level: number, parent?: TreeNode) => {
      for (const n of nodes) {
        const prev = this.meta.get(n);
        const m: NodeMeta = {
          level,
          parent,
          expanded: prev?.expanded ?? !!n.expanded,
          selected: prev?.selected ?? !!n.selected,
          indeterminate: prev?.indeterminate ?? !!n.indeterminate,
        };
        nextMeta.set(n, m);
        if (n.children?.length) setMeta(n.children, level + 1, n);
      }
    };

    setMeta(this.data, 0, undefined);
    this.meta = nextMeta;

    const out: TreeNode[] = [];
    const pushVisible = (node: TreeNode) => {
      out.push(node);
      const kids = node.children ?? [];
      if (kids.length && this.isExpanded(node)) {
        for (const c of kids) pushVisible(c);
      }
    };
    for (const root of this.data) pushVisible(root);
    this.flattenedData = out;
  }

  // -------- expand/collapse ----------
  toggleExpand(node: TreeNode) {
    if (!node.children?.length) return;
    const m = this.getMeta(node);
    m.expanded = !m.expanded;
    this.rebuildMetaAndFlatten();
  }

  // -------- selection ----------
  toggleNodeSelection(node: TreeNode) {
    const m = this.getMeta(node);
    m.selected = !m.selected;
    m.indeterminate = false;

    if (node.children?.length) this.setChildSelection(node.children, m.selected);
    this.updateAllParentStates(this.parent(node));
    this.emitSelection();
  }

  private setChildSelection(nodes: ReadonlyArray<TreeNode>, selected: boolean) {
    for (const child of nodes) {
      const cm = this.getMeta(child);
      cm.selected = selected;
      cm.indeterminate = false;
      if (child.children?.length) this.setChildSelection(child.children, selected);
    }
  }

  private updateAllParentStates(node?: TreeNode) {
    if (!node) return;
    const kids = node.children ?? [];
    if (!kids.length) {
      const m = this.getMeta(node);
      m.indeterminate = false;
    } else {
      const everySel = kids.every(k => this.getMeta(k).selected && !this.getMeta(k).indeterminate);
      const noneSel = kids.every(k => !this.getMeta(k).selected && !this.getMeta(k).indeterminate);
      const pm = this.getMeta(node);
      if (everySel) { pm.selected = true; pm.indeterminate = false; }
      else if (noneSel) { pm.selected = false; pm.indeterminate = false; }
      else { pm.selected = false; pm.indeterminate = true; }
    }
    this.updateAllParentStates(this.parent(node));
  }

  private emitSelection() {
    const selected: TreeNode[] = [];
    const walk = (nodes: ReadonlyArray<TreeNode>) => {
      for (const n of nodes) {
        const m = this.getMeta(n);
        if (m.selected && !m.indeterminate) selected.push(n);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(this.data);
    this.selectionChange.emit(selected);
  }

  // -------- trackBy ----------
  rowTrackBy = (_: number, node: TreeNode) => node.id ?? node;
  colTrackBy = (_: number, col: ColumnComponent) => col.field ?? col.header ?? col;
}
