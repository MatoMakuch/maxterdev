import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItem, TimelineSource } from './timeline-item.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'maxterdev-timeline',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './timeline.component.html',
  styleUrls: [],
})
export class TimelineComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() timelineData: TimelineItem[] = [];

  /** Expanded by default */
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  /** Optional: app-level resolver so icons are NOT hard-coded in the library */
  @Input() sourceIconResolver?: (src: TimelineSource) => string;

  @Output() sourceSelected = new EventEmitter<TimelineSource>();

  @ViewChild('body', { static: true }) bodyRef!: ElementRef<HTMLDivElement>;
  @ViewChild('content', { static: true })
  contentRef!: ElementRef<HTMLDivElement>;

  private ro?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  // ---------- Public helpers (optional) ----------
  /** Programmatically toggle (usable via template ref) */
  public toggle(): void {
    this.setCollapsed(!this.collapsed, true);
  }
  /** Programmatically set state (animate by default) */
  public setCollapsed(value: boolean, animate = true): void {
    if (value === this.collapsed) return;
    this.animateTo(value, animate);
  }

  // ---------- Interaction ----------
  onSourceClick(src: TimelineSource) {
    this.sourceSelected.emit(src);
  }

  getItemHeader(item: TimelineItem): string | undefined {
    return item.header ?? item.title;
  }

  getSourceIcon(src: TimelineSource): string {
    return src.icon ?? this.sourceIconResolver?.(src) ?? 'pi-file';
  }

  // ---------- Lifecycle ----------
  ngAfterViewInit(): void {
    const body = this.bodyRef.nativeElement;

    // Initial paint: set immediately (no transition)
    body.style.transition = 'none';
    if (this.collapsed) {
      body.style.height = '0px';
      body.style.opacity = '0';
    } else {
      body.style.height = `${this.contentRef.nativeElement.scrollHeight}px`;
      body.style.opacity = '1';
      // Let layout settle, then unlock height
      requestAnimationFrame(() => (body.style.height = 'auto'));
    }
    // Re-enable transitions after first frame
    requestAnimationFrame(() => {
      body.style.transition = 'height 250ms ease, opacity 200ms ease';
    });

    // Keep expanded height natural as content changes
    this.ro = new ResizeObserver(() => {
      if (!this.collapsed) {
        const el = this.bodyRef.nativeElement;
        if (el.style.height === 'auto') return;
        el.style.height = 'auto';
      }
    });
    this.ro.observe(this.contentRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle external [(collapsed)] changes after init
    if ('collapsed' in changes && !changes['collapsed'].firstChange) {
      this.animateTo(this.collapsed, true);
    }
  }

  // ---------- Animation core ----------
  private animateTo(targetCollapsed: boolean, animate: boolean): void {
    const body = this.bodyRef?.nativeElement;
    const content = this.contentRef?.nativeElement;
    if (!body || !content) return;

    if (!animate) {
      body.style.transition = 'none';
      if (targetCollapsed) {
        body.style.height = '0px';
        body.style.opacity = '0';
      } else {
        body.style.height = 'auto';
        body.style.opacity = '1';
      }
      // Restore transitions
      requestAnimationFrame(() => {
        body.style.transition = 'height 250ms ease, opacity 200ms ease';
      });
    } else {
      // Ensure transitions are on
      body.style.transition = 'height 250ms ease, opacity 200ms ease';

      if (!targetCollapsed) {
        // expand
        body.style.opacity = '1';
        body.style.height = `${content.scrollHeight}px`;

        const onEnd = (e: TransitionEvent) => {
          if (e.propertyName === 'height') {
            body.style.height = 'auto';
            body.removeEventListener('transitionend', onEnd);
          }
        };
        body.addEventListener('transitionend', onEnd);
      } else {
        // collapse
        body.style.height = `${content.scrollHeight}px`;
        void body.getBoundingClientRect(); // force reflow
        body.style.opacity = '0';
        body.style.height = '0px';
      }
    }

    this.collapsed = targetCollapsed;
    this.collapsedChange.emit(this.collapsed);
    this.cdr.markForCheck();
  }
}
