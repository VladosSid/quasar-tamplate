import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginQuasar from '@quasar/app-vite/eslint';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting';
// Імпортуємо JSON-файл, який автоматично генерує плагін unplugin-auto-import
import autoImportConfig from './.eslintrc-auto-import.json' with { type: 'json' };
export default defineConfigWithVueTs(
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you.
     */
    // ignores: []
  },

  pluginQuasar.configs.recommended(),
  js.configs.recommended,

  /**
   * Змінено рівень суворості Vue з 'essential' на 'recommended'
   * для кращого автоматичного сортування та перевірки тегів.
   */
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  
  // Офіційні TypeScript правила
  vueTsConfigs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        // Розгортаємо змінні автоімпорту (ref, computed, useCounterStore тощо)
        // Це каже ESLint: "Ці змінні глобальні, вони існують, не лайся на них"
        ...autoImportConfig.globals,
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly', // BEX related
      },
    },

    // --- НАШІ КАСТОМНІ ПРАВИЛА ---
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      // 1. Дозволяємо 'any', але з попередженням (warn) у консолі / IDE
      '@typescript-eslint/no-explicit-any': 'warn',

      // 2. Вимикаємо помилку про обов'язковий Reject у промісах (твоє прохання)
      'prefer-promise-reject-errors': 'off',

      // 3. Дозволяємо однослівні назви для сторінок/компонентів (напр. Index.vue)
      'vue/multi-word-component-names': 'off',

      // 4. Debugger та console.log дозволені при розробці, але заборонені у продакшені
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // 5. Невикористані змінні — жорстка помилка (ігноруються лише змінні, що починаються з підкреслення, напр. _idx)
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],

      // 6. Автоматичне сортування атрибутів у Vue компонентах
      'vue/attributes-order': ['error', {
        'order': [
          'DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS',
          'GLOBAL', ['UNIQUE', 'SLOT'], 'TWO_WAY_BINDING', 'OTHER_ATTR', 'EVENTS', 'CONTENT'
        ]
      }]
    },
  },

  // Специфічні глобальні змінні для PWA Service Worker
  {
    files: ['src-pwa/sw/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  // Пропускаємо правила форматування, які бере на себе Prettier
  prettierSkipFormatting,
);