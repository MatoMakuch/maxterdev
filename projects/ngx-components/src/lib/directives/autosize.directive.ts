// autosize.directive.ts
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: 'textarea[autosize]',
  standalone: true,
  exportAs: 'autosize',
})
export class AutosizeDirective implements AfterViewInit, OnDestroy {
  @Input() autosizeDisabled = false;
  @Input() maxRows?: number;

  private observer: ResizeObserver;
  private readonly BORDER_BOX_ADJUSTMENT = 1;

  constructor(private elementRef: ElementRef<HTMLTextAreaElement>) {
    this.observer = new ResizeObserver(() => this.resize());
  }

  ngAfterViewInit(): void {
    this.resize();
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  public resize(): void {
    if (this.autosizeDisabled) return;

    const textarea = this.elementRef.nativeElement;
    const computed = window.getComputedStyle(textarea);

    textarea.style.height = 'auto';

    let contentHeight = textarea.scrollHeight;
    let maxHeight = Infinity;

    if (this.maxRows && this.maxRows > 0) {
      const lineHeight = this.getLineHeight(computed);
      const verticalPadding = this.getVerticalPadding(computed);
      maxHeight = Math.ceil(
        lineHeight * this.maxRows +
          verticalPadding +
          this.BORDER_BOX_ADJUSTMENT,
      );
    }

    const newHeight = Math.min(contentHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }

  public forceReset(): void {
    const textarea = this.elementRef.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.overflowY = 'hidden';
  }

  private getLineHeight(computed: CSSStyleDeclaration): number {
    const lineHeight = parseFloat(computed.lineHeight);
    if (!isNaN(lineHeight)) return lineHeight;

    const fontSize = parseFloat(computed.fontSize);
    return fontSize * 1.2;
  }

  private getVerticalPadding(computed: CSSStyleDeclaration): number {
    return parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
  }
}
