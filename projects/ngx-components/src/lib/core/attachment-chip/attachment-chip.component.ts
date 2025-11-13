import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component'; //
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export interface MaxterdevAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string; // e.g., URL.createObjectURL for images/videos
  progress?: number; // 0..100 (set by app)
  error?: string;
}

@Component({
  selector: 'maxterdev-attachment-chip',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent],
  templateUrl: './attachment-chip.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentChipComponent {
  @Input() attachment!: MaxterdevAttachment;
  @Output() remove = new EventEmitter<string>();

  removeSelf() {
    if (this.attachment?.id) this.remove.emit(this.attachment.id);
  }

  // local helper
  formatBytes(v?: number | null): string {
    const n = v ?? 0;
    if (n < 1024) return `${n} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let i = -1;
    let size = n;
    do {
      size /= 1024;
      i++;
    } while (size >= 1024 && i < units.length - 1);
    return `${size < 10 ? size.toFixed(1) : Math.round(size)} ${units[i]}`;
  }
}
