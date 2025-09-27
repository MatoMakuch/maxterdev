import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
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
export class TimelineComponent implements AfterViewInit, OnDestroy {
  @Input() timelineData: TimelineItem[] = [];
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

  // === Interaction ===
  onSourceClick(src: TimelineSource) {
    this.sourceSelected.emit(src);
  }

  getItemHeader(item: TimelineItem): string | undefined {
    return item.header ?? item.title;
  }

  getSourceIcon(src: TimelineSource): string {
    // Prefer explicit icon; otherwise let the host app decide; fallback safe icon.
    return src.icon ?? this.sourceIconResolver?.(src) ?? 'pi-file';
  }

  // === Expand/Collapse (height-based animation, bullet-proof) ===
  ngAfterViewInit(): void {
    const body = this.bodyRef.nativeElement;

    if (this.collapsed) {
      body.style.height = '0px';
      body.style.opacity = '0';
    } else {
      body.style.height = `${this.contentRef.nativeElement.scrollHeight}px`;
      body.style.opacity = '1';
      requestAnimationFrame(() => (body.style.height = 'auto'));
    }

    // Keep expanded height natural as content changes
    this.ro = new ResizeObserver(() => {
      if (!this.collapsed && body.style.height !== 'auto') return; // anim in flight
      if (!this.collapsed) body.style.height = 'auto';
    });
    this.ro.observe(this.contentRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
  }

  toggleTimeline(): void {
    const body = this.bodyRef.nativeElement;
    const content = this.contentRef.nativeElement;

    body.style.transition = 'height 250ms ease, opacity 200ms ease';

    if (this.collapsed) {
      // EXPAND: 0 -> scrollHeight -> auto
      body.style.opacity = '1';
      body.style.height = `${content.scrollHeight}px`;
      this.collapsed = false;
      this.collapsedChange.emit(false);

      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName === 'height') {
          body.style.height = 'auto';
          body.removeEventListener('transitionend', onEnd);
        }
      };
      body.addEventListener('transitionend', onEnd);
    } else {
      // COLLAPSE: snapshot px -> reflow -> 0
      body.style.height = `${content.scrollHeight}px`;
      void body.getBoundingClientRect(); // force reflow
      body.style.opacity = '0';
      body.style.height = '0px';

      this.collapsed = true;
      this.collapsedChange.emit(true);
    }

    this.cdr.markForCheck();
  }
}
