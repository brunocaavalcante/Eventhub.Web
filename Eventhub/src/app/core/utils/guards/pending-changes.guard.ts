import { CanDeactivateFn } from '@angular/router';

export const pendingChangesGuard: CanDeactivateFn<{ canDeactivate?: () => boolean | any }> = (component) => {
    if (component && typeof component.canDeactivate === 'function') {
        return component.canDeactivate();
    }
    return true;
};
