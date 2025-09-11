import {
  Component, Input, Output, EventEmitter, ContentChild, TemplateRef,
  ViewChild, ElementRef, HostBinding, ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule
} from '@angular/forms';
import { AutosizeDirective } from '../../directives/autosize.directive';

export type FontSize = 'sm' | 'md';

@Component({
  selector: 'maxterdev-input',
  standalone: true,
  imports: [CommonModule, FormsModule, AutosizeDirective],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  // ---- Core API ----
  @Input() multiline = false;
  @Input() type: string = 'text';
  @Input() name = '';
  @Input() id?: string;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;

  // ---- UX extras ----
  @Input() fontSize: FontSize = 'md';
  @Input() autocomplete?: string;
  @Input() inputMode?: string;
  @Input() enterKeyHint?: string;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() pattern?: string;
  @Input() label?: string;
  @Input() describedBy?: string;

  // ---- Autosize ----
  @Input() autosizeDisabled = false;
  @Input() maxRows?: number;
  @ViewChild('autosizeDir') autosizeDirective?: AutosizeDirective;

  // ---- Projected templates ----
  @ContentChild('contentTop', { read: TemplateRef }) topTpl?: TemplateRef<unknown>;
  @ContentChild('contentLeft', { read: TemplateRef }) leftTpl?: TemplateRef<unknown>;
  @ContentChild('contentRight', { read: TemplateRef }) rightTpl?: TemplateRef<unknown>;
  @ContentChild('contentBottom', { read: TemplateRef }) bottomTpl?: TemplateRef<unknown>;

  // ---- DOM Refs ----
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('textareaEl') textareaEl?: ElementRef<HTMLTextAreaElement>;

  // ---- Host classes ----
  @HostBinding('class.maxterdev-input') base = true;
  @HostBinding('class.font-size-sm') get isSm() { return this.fontSize === 'sm'; }
  @HostBinding('class.font-size-md') get isMd() { return this.fontSize === 'md'; }

  // ---- CVA + [(value)] Support ----
  private _value = '';
  private writing = false;

  @Input()
  get value(): string {
    return this._value;
  }
  set value(v: string) {
    if (v !== this._value) {
      this._value = v ?? '';
      this.onChange(this._value);
      if (!this.writing) {
        this.valueChange.emit(this._value);
      }
    }
  }

  @Output() valueChange = new EventEmitter<string>();

  // CVA methods
  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.writing = true;
    this._value = v ?? '';
    this.writing = false;
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ---- Public helpers ----
  focus() {
    (this.multiline ? this.textareaEl : this.inputEl)?.nativeElement.focus();
  }
  blur() {
    (this.multiline ? this.textareaEl : this.inputEl)?.nativeElement.blur();
  }
  resetHeight() {
    requestAnimationFrame(() => this.autosizeDirective?.forceReset());
  }

  // ---- Events ----
  handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }
  handleBlur() {
    this.onTouched();
  }
}
