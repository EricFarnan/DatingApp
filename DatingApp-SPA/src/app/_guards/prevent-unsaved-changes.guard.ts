import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable()

// Guard to present an alert that prevents the user from navigating away while the
// MemberEditComponent's editForm is a dirty state
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
    canDeactivate(component: MemberEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue?\nAny unsaved changes will be lost.');
        }
        return true;
    }
}
