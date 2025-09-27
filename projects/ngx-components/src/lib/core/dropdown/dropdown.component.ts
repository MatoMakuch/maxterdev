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

  /** Optional: match panel width to trigger width */
  @Input() matchTriggerWidth = true;

  /** Optional: viewport margin to keep overlay from touching edges */
  @Input() viewportMargin = 8;

  @Output() selectedOptionsChange = new EventEmitter<any[]>();

  // Internal state management for the overlay
  private isOpen = false;
  private overlayRef: OverlayRef | null = null;
  private backdropClickSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
  ) {}

  toggleDropdown(): void {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private buildPositionStrategy(
    originEl: HTMLElement,
  ): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(originEl)
      .withPositions([
        // Primary: below, left-aligned
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        // Fallback: above, left-aligned
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
      // Reposition when the user scrolls or layout shifts (good inside nested menus/panels)
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'maxterdev-dropdown-panel',
    });

    // Close when clicking outside
    this.backdropClickSubscription = this.overlayRef
      .backdropClick()
      .subscribe(() => this.closeMenu());

    // Attach template
    const portal = new TemplatePortal(this.menuTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // Size to trigger width if desired
    if (this.matchTriggerWidth) {
      const triggerWidth = originEl.getBoundingClientRect().width;
      this.overlayRef.updateSize({ width: triggerWidth });
    }

    // Ensure final geometry after attachment
    this.overlayRef.updatePosition();
    this.isOpen = true;
  }

  private destroyOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private closeMenu(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.isOpen = false;
  }

  // Clean up when the component is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    try {
      this.backdropClickSubscription.unsubscribe();
    } catch {}
    this.destroyOverlay();
  }

  // Selection handlers
  handleSelectedItemsChange(items: any[]): void {
    this.selectedOptions = items ?? [];
    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  handleSingleSelect(item: any): void {
    this.selectedOptions = [item];
    this.selectedOptionsChange.emit(this.selectedOptions);
    this.closeMenu(); // Close the dropdown on single selection
  }

  getSelectedOptionText(): string {
    if (this.selectedOptions?.length) {
      return this.selectedOptions.join(', ');
    }
    return this.placeholder;
  }
}
