
export default {
  ssr: false,
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
    }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Courgette&family=Kaushan+Script&family=Poiret+One&family=WindSong:wght@500&display=swap"
    },],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  server: {
    host: '',
    port: '3001',
  },
  css: [
    "@/assets/css/main.scss"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/main",
    "~/plugins/custom/directives/appear",
    "~/plugins/custom/directives/scrollby",
    "~/plugins/font-awesome-filter"

  ],
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome',
  ],
  fontawesome: {
    component: "fa",
    icons: {
      solid: ['faArrowRight', 'faEnvelopeSquare', 'faBullseye', "faEuroSign", "faClock"],
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [

  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
