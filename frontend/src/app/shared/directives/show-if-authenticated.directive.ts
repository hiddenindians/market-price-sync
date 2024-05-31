import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Directive({
  selector: '[appShowIfAuthenticated]'
})
export class ShowIfAuthenticatedDirective {
  constructor(
    private userService: UserService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appShowIfAuthenticated(condition: boolean) {
    if (this.userService.isAuthenticated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}