import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';

let nextId = 0;

export type ComponentSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'maxterdev-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent {
  @ViewChild('nativeCheckbox')
  private inputElement!: ElementRef<HTMLInputElement>;

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;
  @Input() size: ComponentSize = 'md';

  private _indeterminate = false;

  @Input()
  set indeterminate(value: boolean) {
    this._indeterminate = value;
    this.updateIndeterminateState();
  }
  get indeterminate(): boolean {
    return this._indeterminate;
  }

  // This naming convention allows for two-way binding: [(checked)]="myVar"
  @Output() checkedChange = new EventEmitter<boolean>();

  // A unique ID for the native input, used to link the <label> to it.
  @Input() id: string = `maxterdev-checkbox-${++nextId}`;

  @HostBinding('class.checked')
  get isChecked() {
    return this.checked;
  }

  @HostBinding('class.disabled')
  get isDisabled() {
    return this.disabled;
  }

  @HostBinding('class.indeterminate')
  get isIndeterminate() {
    return this.indeterminate;
  }

  ngAfterViewInit(): void {
    this.updateIndeterminateState();
  }

  private updateIndeterminateState(): void {
    if (this.inputElement && this.inputElement.nativeElement) {
      this.inputElement.nativeElement.indeterminate = this.indeterminate;
    }
  }

  onToggle(): void {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.indeterminate = false;

    this.checkedChange.emit(this.checked);
  }
}
