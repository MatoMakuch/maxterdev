import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutosizeDirective } from '../../directives/autosize.directive';

@Component({
  selector: 'maxterdev-input',
  standalone: true,
  imports: [CommonModule, FormsModule, AutosizeDirective],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() placeholder: string = 'Select an option';
  @Input() multiline: boolean = false;

  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  @Input() autosizeDisabled: boolean = false;
  @Input() maxRows?: number;

  @Input() inputContentRight?: TemplateRef<any>;
  @ContentChild(TemplateRef) contentContentRight?: TemplateRef<any>;

  get contentRightTemplate(): TemplateRef<any> | null {
    return this.inputContentRight || this.contentContentRight || null;
  }
  
  protected onValueChange(): void {
    this.valueChange.emit(this.value);
  }
}
