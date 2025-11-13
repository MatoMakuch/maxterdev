import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostBinding,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { AutosizeDirective } from '../../directives/autosize.directive';

// Import the chip + its type from your new component
import {
  AttachmentChipComponent,
  MaxterdevAttachment,
} from '../attachment-chip/attachment-chip.component';

export type FontSize = 'sm' | 'md';

@Component({
  selector: 'maxterdev-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutosizeDirective,
    AttachmentChipComponent,
  ],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
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
  @ContentChild('contentTop', { read: TemplateRef })
  topTpl?: TemplateRef<unknown>;
  @ContentChild('contentLeft', { read: TemplateRef })
  leftTpl?: TemplateRef<unknown>;
  @ContentChild('contentRight', { read: TemplateRef })
  rightTpl?: TemplateRef<unknown>;
  @ContentChild('contentBottom', { read: TemplateRef })
  bottomTpl?: TemplateRef<unknown>;

  // ---- DOM Refs ----
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('textareaEl') textareaEl?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // ---- Host classes ----
  @HostBinding('class.maxterdev-input') base = true;
  @HostBinding('class.font-size-sm') get isSm() {
    return this.fontSize === 'sm';
  }
  @HostBinding('class.font-size-md') get isMd() {
    return this.fontSize === 'md';
  }

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
      if (!this.writing) this.valueChange.emit(this._value);
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

  // ---- Attachments API (NEW) ----
  /** Enable/disable attachment UX (drop, paste, file picker, chip well). */
  @Input() allowAttachments = true;
  /** Native input accept filter, e.g. "image/*,application/pdf". */
  @Input() accept?: string;
  /** Allow multiple file selection. */
  @Input() multiple = true;
  /** Attachments to render as chips (app owns the array). */
  @Input() attachments: MaxterdevAttachment[] = [];

  /** Emits raw files coming from drop/paste/native input. */
  @Output() filesAdded = new EventEmitter<File[]>();
  /** Optional: two-way bind if you want [(attachments)] from the app. */
  @Output() attachmentsChange = new EventEmitter<MaxterdevAttachment[]>();
  /** User requested removal of an attachment by id. */
  @Output() attachmentRemove = new EventEmitter<string>();

  // ---- Drag & paste state ----
  isDragOver = false;

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

  /** Expose native file picker so consumers can trigger it (e.g., from #contentRight button). */
  openFilePicker() {
    if (!this.allowAttachments || this.disabled || this.readonly) return;
    this.fileInput?.nativeElement.click();
  }

  // ---- Events ----
  handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }
  handleBlur() {
    this.onTouched();
  }

  // Native <input type="file"> change
  onNativeFiles(e: Event) {
    if (!this.allowAttachments) return;
    const list = (e.target as HTMLInputElement).files;
    const files = Array.from(list ?? []);
    if (files.length) this.filesAdded.emit(files);
    // reset value so selecting the same file(s) again still fires change
    (e.target as HTMLInputElement).value = '';
  }

  // Paste event on input/textarea
  onPaste(e: ClipboardEvent) {
    if (!this.allowAttachments) return;
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length) this.filesAdded.emit(files);
  }

  // Drag & drop on the content container
  onDragOver(e: DragEvent) {
    if (!this.allowAttachments) return;
    if (!e.dataTransfer) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    this.isDragOver = true;
  }
  onDragLeave(e: DragEvent) {
    if (!this.allowAttachments) return;
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = false;
  }
  onDrop(e: DragEvent) {
    if (!this.allowAttachments) return;
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = false;
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (files.length) this.filesAdded.emit(files);
  }

  // User clicked the X on a chip
  onRemove(id: string) {
    this.attachmentRemove.emit(id);
  }

  // TrackBy for chips
  trackById = (_: number, a: MaxterdevAttachment) => a.id;
}
