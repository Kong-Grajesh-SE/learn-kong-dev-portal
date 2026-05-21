import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kong Developer Portal Bootcamp',
  description: 'Kong Partner Enablement - Developer Portal: publish APIs, configure OIDC SSO, and manage teams with RBAC on Konnect.',

  srcDir: '..',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  base: '/learn-kong-dev-portal/',

  appearance: 'force-dark',
  cleanUrls: true,

  ignoreDeadLinks: true,

  rewrites: {
    'module-01-developer-portal/README.md': 'module-01-developer-portal/index.md',
  },

  srcExclude: [
    'node_modules/**',
    'dist/**',
    'docs/.vitepress/**',
    '.vitepress-cache/**',
    'README.md',
    '.github/**',
  ],

  head: [
    ['link', { rel: 'icon',           href: '/learn-kong-dev-portal/favicon.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'shortcut icon',  href: '/learn-kong-dev-portal/favicon.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/learn-kong-dev-portal/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#000F06' }],
    ['meta', { property: 'og:title', content: 'Kong Developer Portal Bootcamp' }],
    ['meta', { property: 'og:description', content: 'Hands-on labs: publish APIs to Developer Portal, OIDC SSO, RBAC teams' }],
    ['meta', { property: 'og:image', content: '/learn-kong-dev-portal/kong-konnect-logo.svg' }],
  ],

  markdown: {
    theme: { light: 'github-light', dark: 'one-dark-pro' },
    lineNumbers: true,
  },

  themeConfig: {
    logo: '/kong-logomark-lime.svg',
    siteTitle: 'Developer Portal Bootcamp',

    nav: [
      { text: '🏠 Home', link: '/' },
      {
        text: '� Getting Started',
        items: [
          { text: '✅ Prerequisites', link: '/prerequisites' },
        ],
      },
      {
        text: '📚 Modules',
        items: [
          { text: '📋 Overview',            link: '/module-01-developer-portal/' },
          { text: '🌐 Developer Portal',    link: '/module-01-developer-portal/labs/01-dev-portal' },
          { text: '🔐 OIDC Auth Code Flow', link: '/module-01-developer-portal/labs/01-oidc-auth-code' },
          { text: '👥 RBAC & Teams',        link: '/module-01-developer-portal/labs/01-rbac-teams' },
        ],
      },

      {
        text: '🔗 Resources',
        items: [
          { text: '📖 Developer Portal Docs', link: 'https://developer.konghq.com/dev-portal/', target: '_blank' },
          { text: '📖 RBAC Docs',             link: 'https://developer.konghq.com/gateway/kong-manager/rbac/', target: '_blank' },
          { text: '☁️ Konnect',              link: 'https://cloud.konghq.com', target: '_blank' },
        ],
      },
      { text: '🏠 All Bootcamps', link: 'https://kong-grajesh-se.github.io/learn-kong-bootcamps/', target: '_blank' },
    ],

    sidebar: [
      {
        text: '🚀 Getting Started',
        collapsed: false,
        items: [
          { text: '📋 Prerequisites', link: '/prerequisites' },
        ],
      },
      {
        text: '🌐 Developer Portal',
        collapsed: false,
        items: [
          { text: '📋 Overview',              link: '/module-01-developer-portal/' },
          { text: '🌐 Lab: Developer Portal', link: '/module-01-developer-portal/labs/01-dev-portal' },
          { text: '🔐 Lab: OIDC Auth Code',   link: '/module-01-developer-portal/labs/01-oidc-auth-code' },
          { text: '👥 Lab: RBAC & Teams',     link: '/module-01-developer-portal/labs/01-rbac-teams' },
        ],
      },
    ],

    editLink: {
      pattern: 'https://github.com/Kong-Grajesh-SE/learn-kong-dev-portal/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated',
      formatOptions: { dateStyle: 'medium' },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kong-Grajesh-SE/learn-kong-dev-portal' },
    ],

    footer: {
      message: 'Kong Developer Portal Bootcamp - Partner Enablement',
      copyright: '© Kong Inc. 2026 - The AI Connectivity Company',
    },

    search: { provider: 'local' },
  },
})
