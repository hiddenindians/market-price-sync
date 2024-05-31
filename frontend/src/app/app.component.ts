import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatNavList } from '@angular/material/list'
import { NavigationComponent } from './shared/layout/navigation/navigation.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent,LoginComponent, HeaderComponent, FooterComponent, MatSidenavModule, MatNavList],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'frontend';


}
