import { Injectable } from '@angular/core';

export interface Closable {
  forceClose: (reason?: string) => void;
}

@Injectable({ providedIn: 'root' })
export class MenuCoordinatorService {
  private openByGroup = new Map<string, Closable>();

  requestOpen(group: string, next: Closable) {
    const prev = this.openByGroup.get(group);
    if (prev && prev !== next) prev.forceClose('switch');
    this.openByGroup.set(group, next);
  }

  notifyClosed(group: string, inst: Closable) {
    if (this.openByGroup.get(group) === inst) this.openByGroup.delete(group);
  }

  closeGroup(group: string) {
    const prev = this.openByGroup.get(group);
    if (prev) prev.forceClose('programmatic');
    this.openByGroup.delete(group);
  }

  closeAll() {
    for (const [, prev] of this.openByGroup) prev.forceClose('programmatic');
    this.openByGroup.clear();
  }
}
