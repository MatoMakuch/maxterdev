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

  @Input() inputContentTop?: TemplateRef<any>;
  @Input() inputContentLeft?: TemplateRef<any>;
  @Input() inputContentRight?: TemplateRef<any>;
  @Input() inputContentBottom?: TemplateRef<any>;

  @ContentChild('contentTop',    { read: TemplateRef }) contentTplTop?:    TemplateRef<any>;
  @ContentChild('contentLeft',   { read: TemplateRef }) contentTplLeft?:   TemplateRef<any>;
  @ContentChild('contentRight',  { read: TemplateRef }) contentTplRight?:  TemplateRef<any>;
  @ContentChild('contentBottom', { read: TemplateRef }) contentTplBottom?: TemplateRef<any>;

  // Pick whichever was provided
  get contentTopTemplate(): TemplateRef<any> | null {
    return this.inputContentTop || this.contentTplTop || null;
  }
  get contentLeftTemplate(): TemplateRef<any> | null {
    return this.inputContentLeft || this.contentTplLeft || null;
  }
  get contentRightTemplate(): TemplateRef<any> | null {
    return this.inputContentRight || this.contentTplRight || null;
  }
  get contentBottomTemplate(): TemplateRef<any> | null {
    return this.inputContentBottom || this.contentTplBottom || null;
  }
  
  protected onValueChange(): void {
    this.valueChange.emit(this.value);
  }
}
