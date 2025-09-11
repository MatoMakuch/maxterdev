import { Component, ElementRef, HostListener, ViewChild, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: []
})
export class MenuComponent {

  @HostBinding('class.menu-open') get hostOpen() { return this.isOpen; }
  isOpen = false;
  panelStyles: Partial<CSSStyleDeclaration> = {};

  @ViewChild('triggerRef', { static: false }) triggerRef!: ElementRef<HTMLElement>;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  constructor(private host: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocClick(ev: Event) {
    if (!this.host.nativeElement.contains(ev.target)) {
      if (this.isOpen) { this.isOpen = false; this.closed.emit(); }
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange() {
    if (this.isOpen) this.positionPanel();
  }

  toggle(ev: Event) {
    ev.stopPropagation();
    this.isOpen = !this.isOpen;
    if (this.isOpen) { this.positionPanel(); this.opened.emit(); }
    else { this.closed.emit(); }
  }

  private positionPanel() {
  const trigger = this.triggerRef?.nativeElement;
  if (!trigger) return;

  const rect = trigger.getBoundingClientRect();
  const gutter = 8;

  // If the panel already exists, measure it; otherwise use a sane default
  const panelEl = this.host.nativeElement.querySelector('.menu-panel') as HTMLElement | null;
  const panelW = panelEl?.offsetWidth || 260;
  const panelH = panelEl?.offsetHeight || 0;

  // Try to open to the RIGHT of the trigger (left-aligned with trigger)
  let left = rect.left;
  if (left + panelW > window.innerWidth - gutter) {
    // Not enough room on the right → open to the LEFT (right-aligned with trigger)
    left = rect.right - panelW;
  }

  // Clamp within viewport
  left = Math.max(gutter, Math.min(left, window.innerWidth - panelW - gutter));

  // Prefer below; flip above if not enough space
  let top = rect.bottom + gutter;
  if (panelH && top + panelH > window.innerHeight - gutter) {
    top = Math.max(gutter, rect.top - gutter - panelH);
  }

  this.panelStyles = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: '20000',
    maxHeight: 'min(60vh, 480px)',
    overflow: 'auto'
  };

  // Re-measure on next frame (gets real sizes once content is painted)
  requestAnimationFrame(() => {
    const pe = this.host.nativeElement.querySelector('.menu-panel') as HTMLElement | null;
    if (!pe) return;
    const w = pe.offsetWidth || panelW;
    const h = pe.offsetHeight || panelH;

    let L = rect.left;
    if (L + w > window.innerWidth - gutter) L = rect.right - w;
    L = Math.max(gutter, Math.min(L, window.innerWidth - w - gutter));

    let T = rect.bottom + gutter;
    if (h && T + h > window.innerHeight - gutter) T = Math.max(gutter, rect.top - gutter - h);

    this.panelStyles = { ...this.panelStyles, left: `${L}px`, top: `${T}px` };
  });
}
}
