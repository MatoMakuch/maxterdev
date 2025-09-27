import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ColumnHeaderTemplateDirective,
  ColumnBodyTemplateDirective,
} from '../../directives/table-column.directive';

@Component({
  selector: 'maxterdev-column',
  standalone: true,
  imports: [CommonModule],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent<T = any> {
  /** Key in row object used for default cell rendering */
  @Input() field = '';
  /** Header text when no custom header template is provided */
  @Input() header = '';

  @ContentChild(ColumnHeaderTemplateDirective, { read: TemplateRef })
  headerTemplate?: TemplateRef<any>;
  @ContentChild(ColumnBodyTemplateDirective, { read: TemplateRef })
  bodyTemplate?: TemplateRef<any>;
}
