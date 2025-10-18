import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';

export default {
    ...createCjsPreset(),
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
} satisfies Config;