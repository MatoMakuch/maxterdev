import { Component, Input, Output, EventEmitter, ContentChild, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutosizeDirective } from '../../directives/autosize.directive';

@Component({
  selector: 'maxterdev-input',
  standalone: true,
  imports: [CommonModule, FormsModule, AutosizeDirective],
  templateUrl: './input.component.html',
  styleUrls: [],
})
export class InputComponent {
  @Input() type: string = "";
  @Input() name: string = "";
  @Input() placeholder: string = 'Select an option';
  @Input() multiline: boolean = false;

  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  @Input() autosizeDisabled: boolean = false;
  @Input() maxRows?: number;

  @Input() contentTopTemplate?: TemplateRef<any>;
  @Input() contentLeftTemplate?: TemplateRef<any>;
  @Input() contentRightTemplate?: TemplateRef<any>;
  @Input() contentBottomTemplate?: TemplateRef<any>;

  @ContentChild('contentTop', { read: TemplateRef }) contentTopContentChild?: TemplateRef<any>;
  @ContentChild('contentLeft', { read: TemplateRef }) contentLeftContentChild?: TemplateRef<any>;
  @ContentChild('contentRight', { read: TemplateRef }) contentRightContentChild?: TemplateRef<any>;
  @ContentChild('contentBottom', { read: TemplateRef }) contentBottomContentChild?: TemplateRef<any>;

  get contentTop(): TemplateRef<any> | null {
    return this.contentTopTemplate || this.contentTopContentChild || null;
  }
  get contentLeft(): TemplateRef<any> | null {
    return this.contentLeftTemplate || this.contentLeftContentChild || null;
  }
  get contentRight(): TemplateRef<any> | null {
    return this.contentRightTemplate || this.contentRightContentChild || null;
  }
  get contentBottom(): TemplateRef<any> | null {
    return this.contentBottomTemplate || this.contentBottomContentChild || null;
  }

  @ViewChild('autosizeDir') 
  autosizeDirective?: AutosizeDirective;

  public resetHeight() {
    setTimeout(() => {
      this.autosizeDirective?.forceReset();
    }, 0);
  }
  
  protected onValueChange(): void {
    this.valueChange.emit(this.value);
  }
}
