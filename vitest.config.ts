import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    // La suite parser arriva con la spec 002; il gate resta valido anche
    // nello scaffold.
    passWithNoTests: true,
  },
});
