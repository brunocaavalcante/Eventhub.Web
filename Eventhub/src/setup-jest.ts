import 'jest-preset-angular/setup-env/zone';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';
import 'whatwg-fetch';

// Inicializa o ambiente de testes do Angular
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
