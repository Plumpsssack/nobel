module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {

    extend: {
      // colors: {
      //   primary: '#d59237',
      //   secondary: '#877c6a',
      //   third:'#894718',
      //   'primary-gray': {
      //     'light': '#ceccc9',
      //     'normal': '#848485',
      //     'dark': '#2f2c2a'
      //   }
      // },
      colors: {

        // primary: '#D9779B',
        // primary: '#ed832f',
        // secondary: '#7BE0AD',

        primary: '#ed832f',
        secondary: '#fffcf7ff',
        third: '#AEE5D8',
        fourth: '#E7E5E5',
        // 
        // secondary: '#507346',
        // third: '#BF454F',
        // fourth: '#BF988A',


        // primary: '#f75c03ff',
        // secondary: '#48a9a6ff',
        // third: '#820263ff',
        // fourth: '#336699ff',
        white: '#fffcf7ff',

        'primary-gray': {
          'light': '#ceccc9',
          'normal': '#848485',
          'dark': '#2f2c2a'
        }
      },
      backgroundImage: theme => ({
        'nobel-bass': "url('~/assets/img/nobel_bass.jpg')",
        'nobel-cover': "url('~/assets/img/nobel_background.jpg')"

      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
