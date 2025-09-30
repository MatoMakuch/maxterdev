import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnDestroy,
  InjectionToken,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCoordinatorService, Closable } from './menu-coordinator.service';

/** Portalized children (e.g., CDK overlays) can register their roots as “inside”. */
export interface MenuCloseBoundary {
  registerRelatedRoot(el: HTMLElement): void;
  unregisterRelatedRoot(el: HTMLElement): void;
  /** Mark a specific event so the menu will NOT treat it as outside-click. */
  suppressOutsideCloseForEvent(ev: Event): void;
}
export const MENU_PARENT = new InjectionToken<MenuCloseBoundary>('MENU_PARENT');

@Component({
  selector: 'maxterdev-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: [],
  providers: [
    { provide: MENU_PARENT, useExisting: forwardRef(() => MenuComponent) },
  ],
})
export class MenuComponent implements OnDestroy, Closable, MenuCloseBoundary {
  @Input() group = 'global';

  @HostBinding('class.menu-open')
  get hostOpen() {
    return this.isOpen;
  }

  isOpen = false;
  panelStyles: Partial<CSSStyleDeclaration> = {};

  @ViewChild('triggerRef', { static: false })
  triggerRef!: ElementRef<HTMLElement>;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private relatedRoots = new Set<HTMLElement>();
  private ignoreClicks = new WeakSet<Event>(); // one-shot suppression

  constructor(
    private host: ElementRef<HTMLElement>,
    private coord: MenuCoordinatorService
  ) {}

  ngOnDestroy(): void {
    if (this.isOpen) this.coord.notifyClosed(this.group, this);
    this.relatedRoots.clear();
  }

  // ---------- MenuCloseBoundary API ----------
  registerRelatedRoot = (el: HTMLElement) => this.relatedRoots.add(el);
  unregisterRelatedRoot = (el: HTMLElement) => this.relatedRoots.delete(el);
  suppressOutsideCloseForEvent = (ev: Event) => this.ignoreClicks.add(ev);

  // ---------- Outside click handling ----------
  @HostListener('document:click', ['$event'])
  onDocClick(ev: Event) {
    if (!this.isOpen) return;

    // If a child overlay captured this exact event, ignore it once.
    if (this.ignoreClicks.has(ev)) {
      this.ignoreClicks.delete(ev);
      return;
    }

    const t = ev.target as Node;
    const insideHost = this.host.nativeElement.contains(t);
    const insideRelated = Array.from(this.relatedRoots).some((r) =>
      r.contains(t)
    );
    if (!insideHost && !insideRelated) this.forceClose('outside');
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange() {
    if (this.isOpen) this.positionPanel();
  }

  toggle(ev: Event) {
    ev.stopPropagation(); // preserve nested interactions
    if (this.isOpen) {
      this.forceClose('toggle');
      return;
    }
    this.coord.requestOpen(this.group, this); // single-open guarantee
    this.isOpen = true;
    this.positionPanel();
    this.opened.emit();
  }

  forceClose = (_reason?: string) => {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.closed.emit();
    this.coord.notifyClosed(this.group, this);
  };

  private positionPanel() {
    const trigger = this.triggerRef?.nativeElement;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gutter = 8;

    const panelEl = this.host.nativeElement.querySelector(
      '.menu-panel'
    ) as HTMLElement | null;
    const panelW = panelEl?.offsetWidth || 260;
    const panelH = panelEl?.offsetHeight || 0;

    let left = rect.left;
    if (left + panelW > window.innerWidth - gutter) left = rect.right - panelW;
    left = Math.max(
      gutter,
      Math.min(left, window.innerWidth - panelW - gutter)
    );

    let top = rect.bottom + gutter;
    if (panelH && top + panelH > window.innerHeight - gutter) {
      top = Math.max(gutter, rect.top - gutter - panelH);
    }

    this.panelStyles = {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: '1000',
      maxHeight: 'min(60vh, 480px)',
      overflow: 'auto',
    };

    requestAnimationFrame(() => {
      const pe = this.host.nativeElement.querySelector(
        '.menu-panel'
      ) as HTMLElement | null;
      if (!pe) return;
      const w = pe.offsetWidth || panelW;
      const h = pe.offsetHeight || panelH;

      let L = rect.left;
      if (L + w > window.innerWidth - gutter) L = rect.right - w;
      L = Math.max(gutter, Math.min(L, window.innerWidth - w - gutter));

      let T = rect.bottom + gutter;
      if (h && T + h > window.innerHeight - gutter)
        T = Math.max(gutter, rect.top - gutter - h);

      this.panelStyles = { ...this.panelStyles, left: `${L}px`, top: `${T}px` };
    });
  }
}
