import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-tab',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styleUrls: [],
})
export class TabComponent {
  @Input() title: string = '';
  @Input() active: boolean = false;
  @Input() disabled: boolean = false;

  @HostBinding('hidden')
  get isHidden(): boolean {
    return !this.active;
  }
}
