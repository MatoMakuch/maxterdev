import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from './column.component';
import {
  ColumnHeaderTemplateDirective,
  ColumnBodyTemplateDirective,
} from '../../directives/table-column.directive';

export type ComponentSize = 'sm' | 'md' | 'lg';
export type Row = Record<string, unknown>;

@Component({
  selector: 'maxterdev-table',
  standalone: true,
  imports: [
    CommonModule,
    ColumnComponent,
    ColumnHeaderTemplateDirective,
    ColumnBodyTemplateDirective,
  ],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends Row = Row> {
  @Input() data: ReadonlyArray<T> = [];
  @Input() size: ComponentSize = 'md';
  @Input() caption?: string;
  @Input() noDataText = 'No data';
  @Input() trackBy: (index: number, item: T) => unknown = (_, item) => item;

  @ContentChildren(ColumnComponent, { descendants: true }) columns!: QueryList<
    ColumnComponent<T>
  >;

  @HostBinding('class') hostClass = 'maxterdev-table';
  @HostBinding('class.size-sm') get isSm() {
    return this.size === 'sm';
  }
  @HostBinding('class.size-md') get isMd() {
    return this.size === 'md';
  }
  @HostBinding('class.size-lg') get isLg() {
    return this.size === 'lg';
  }
}
