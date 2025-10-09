import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[maxterdevColumnHeader]',
  standalone: true,
})
export class ColumnHeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  selector: '[maxterdevColumnBody]',
  standalone: true,
})
export class ColumnBodyTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
