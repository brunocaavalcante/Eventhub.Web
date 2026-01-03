import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutComponent } from "./views/base/layout/layout.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'Eventhub';
}
