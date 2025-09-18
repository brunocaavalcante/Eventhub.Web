import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule, CarouselModule],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
    carouselOptions = {
        items: 1,
        dots: false,
        nav: false,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplayHoverPause: false,
        margin: 0,
        responsive: {
            '0': { items: 1 },
            '600': { items: 1 },
            '900': { items: 1 }
        }
    };
}
