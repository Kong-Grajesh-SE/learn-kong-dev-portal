import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kong Developer Portal Bootcamp',
  description: 'Kong Partner Enablement — Developer Portal: publish APIs, configure OIDC SSO, and manage teams with RBAC on Konnect.',

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
        text: '📚 Module',
        items: [
          { text: '📋 Overview',            link: '/module-01-developer-portal/' },
          { text: '🌐 Developer Portal',    link: '/module-01-developer-portal/labs/09-dev-portal' },
          { text: '🔐 OIDC Auth Code Flow', link: '/module-01-developer-portal/labs/09-oidc-auth-code' },
          { text: '👥 RBAC & Teams',        link: '/module-01-developer-portal/labs/09-rbac-teams' },
        ],
      },
      {
        text: '🚀 Specialist Bootcamps',
        items: [
          { text: '🏠 API Gateway Bootcamp',  link: 'https://kong-grajesh-se.github.io/learn-kong-gateway/', target: '_blank' },
          { text: '🤖 AI Gateway Bootcamp',   link: 'https://kong-grajesh-se.github.io/learn-kong-ai-gateway/', target: '_blank' },
          { text: '🛠️ Agentic AI & MCP',      link: 'https://kong-grajesh-se.github.io/learn-kong-agentic-bootcamp/', target: '_blank' },
          { text: '🔄 APIOps with decK',      link: 'https://kong-grajesh-se.github.io/learn-kong-apiops-bootcamp/', target: '_blank' },
          { text: '🎮 Insomnia Bootcamp',     link: 'https://kong-grajesh-se.github.io/learn-insomnia/', target: '_blank' },
          { text: '🤝 Bring Your Own Agent',  link: 'https://kong-grajesh-se.github.io/bring-your-own-agent/', target: '_blank' },
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
    ],

    sidebar: [
      {
        text: '🌐 Developer Portal',
        collapsed: false,
        items: [
          { text: '📋 Overview',              link: '/module-01-developer-portal/' },
          { text: '🌐 Lab: Developer Portal', link: '/module-01-developer-portal/labs/09-dev-portal' },
          { text: '🔐 Lab: OIDC Auth Code',   link: '/module-01-developer-portal/labs/09-oidc-auth-code' },
          { text: '👥 Lab: RBAC & Teams',     link: '/module-01-developer-portal/labs/09-rbac-teams' },
        ],
      },
      {
        text: '🚀 Specialist Bootcamps',
        collapsed: true,
        items: [
          { text: '🏠 API Gateway Bootcamp',  link: 'https://kong-grajesh-se.github.io/learn-kong-gateway/' },
          { text: '🤖 AI Gateway Bootcamp',   link: 'https://kong-grajesh-se.github.io/learn-kong-ai-gateway/' },
          { text: '🛠️ Agentic AI & MCP',      link: 'https://kong-grajesh-se.github.io/learn-kong-agentic-bootcamp/' },
          { text: '🔄 APIOps with decK',      link: 'https://kong-grajesh-se.github.io/learn-kong-apiops-bootcamp/' },
          { text: '🎮 Insomnia Bootcamp',     link: 'https://kong-grajesh-se.github.io/learn-insomnia/' },
          { text: '🤝 Bring Your Own Agent',  link: 'https://kong-grajesh-se.github.io/bring-your-own-agent/' },
        ],
      },
    ],

    editLink: {
      pattern: 'https://github.com/Kong-Grajesh-SE/learn-dev-portal/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated',
      formatOptions: { dateStyle: 'medium' },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kong-Grajesh-SE/learn-dev-portal' },
    ],

    footer: {
      message: 'Kong Developer Portal Bootcamp — Partner Enablement',
      copyright: '© Kong Inc. 2026 — The AI Connectivity Company',
    },

    search: { provider: 'local' },
  },
})
