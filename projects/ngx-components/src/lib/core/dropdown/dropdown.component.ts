import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
  HostBinding,
  Inject,
  Optional,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';

import {
  Overlay,
  OverlayModule,
  OverlayRef,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

import { MENU_PARENT, MenuCloseBoundary } from '../menu/menu.component';

@Component({
  selector: 'maxterdev-dropdown',
  standalone: true,
  imports: [CommonModule, ListComponent, OverlayModule],
  templateUrl: './dropdown.component.html',
  styleUrls: [],
})
export class DropdownComponent implements OnDestroy {
  @ViewChild('menuTemplate') menuTemplate!: TemplateRef<any>;
  @ViewChild('trigger', { read: ElementRef })
  triggerRef!: ElementRef<HTMLElement>;

  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() isMultiSelect: boolean = false;
  @Input() selectedOptions: any[] = [];
  @Input() size: 'md' | 'sm' = 'md';
  @Input() matchTriggerWidth = true;
  @Input() viewportMargin = 8;

  @Output() selectedOptionsChange = new EventEmitter<any[]>();

  @HostBinding('class') get hostSizeClass() {
    return this.size;
  }

  private isOpen = false;
  private overlayRef: OverlayRef | null = null;
  private backdropClickSub: Subscription = Subscription.EMPTY;
  private contentCaptureHandler?: (ev: Event) => void;

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    @Optional() @Inject(MENU_PARENT) private parentMenu?: MenuCloseBoundary
  ) {}

  toggleDropdown(): void {
    if (this.isOpen) this.closeMenu();
    else this.openMenu();
  }

  private buildPositionStrategy(
    originEl: HTMLElement
  ): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(originEl)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ])
      .withPush(true)
      .withViewportMargin(this.viewportMargin);
  }

  private openMenu(): void {
    const originEl =
      this.triggerRef?.nativeElement ?? this.elementRef.nativeElement;
    const positionStrategy = this.buildPositionStrategy(originEl);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'maxterdev-dropdown-panel',
    });

    // Register roots so the parent menu treats them as “inside”.
    this.parentMenu?.registerRelatedRoot(this.overlayRef.overlayElement);
    if (this.overlayRef.backdropElement) {
      this.parentMenu?.registerRelatedRoot(this.overlayRef.backdropElement);
    }

    // Capture clicks INSIDE overlay content before they bubble to document,
    // and tell the menu to ignore this event once (prevents menu from closing
    // when the dropdown closes itself in response to selection).
    this.contentCaptureHandler = (ev: Event) =>
      this.parentMenu?.suppressOutsideCloseForEvent(ev);
    this.overlayRef.overlayElement.addEventListener(
      'click',
      this.contentCaptureHandler,
      true
    );

    // Close dropdown on backdrop clicks (but keep the menu open because backdrop is registered)
    this.backdropClickSub = this.overlayRef
      .backdropClick()
      .subscribe(() => this.closeMenu());

    // Attach portal
    const portal = new TemplatePortal(this.menuTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // Optional: match width
    if (this.matchTriggerWidth) {
      const triggerWidth = originEl.getBoundingClientRect().width;
      this.overlayRef.updateSize({ width: triggerWidth });
    }

    this.overlayRef.updatePosition();
    this.isOpen = true;
  }

  private closeMenu(): void {
    if (!this.overlayRef) {
      this.isOpen = false;
      return;
    }

    // Remove capture listener first
    if (this.contentCaptureHandler) {
      this.overlayRef.overlayElement.removeEventListener(
        'click',
        this.contentCaptureHandler,
        true
      );
      this.contentCaptureHandler = undefined;
    }

    // Unregister related roots (overlay + backdrop)
    this.parentMenu?.unregisterRelatedRoot(this.overlayRef.overlayElement);
    if (this.overlayRef.backdropElement) {
      this.parentMenu?.unregisterRelatedRoot(this.overlayRef.backdropElement);
    }

    this.overlayRef.detach();
    this.isOpen = false;
  }

  private destroyOverlay(): void {
    if (!this.overlayRef) return;

    if (this.contentCaptureHandler) {
      this.overlayRef.overlayElement.removeEventListener(
        'click',
        this.contentCaptureHandler,
        true
      );
      this.contentCaptureHandler = undefined;
    }

    this.parentMenu?.unregisterRelatedRoot(this.overlayRef.overlayElement);
    if (this.overlayRef.backdropElement) {
      this.parentMenu?.unregisterRelatedRoot(this.overlayRef.backdropElement);
    }

    this.overlayRef.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    try {
      this.backdropClickSub.unsubscribe();
    } catch {}
    this.destroyOverlay();
  }

  // -------- Selection handlers --------------------------------------
  handleSelectedItemsChange(items: any[]): void {
    this.selectedOptions = items ?? [];
    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  handleSingleSelect(item: any): void {
    this.selectedOptions = [item];
    this.selectedOptionsChange.emit(this.selectedOptions);
    this.closeMenu(); // closes only the dropdown; menu stays open
  }

  getSelectedOptionText(): string {
    return this.selectedOptions?.length
      ? this.selectedOptions.join(', ')
      : this.placeholder;
  }
}
