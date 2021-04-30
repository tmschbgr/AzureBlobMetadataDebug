import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#d93954', // $rose
        secondary: '#b0bec5',
        accent: '#d93954', // $rose
        error: '#b71c1c',
        background: '#ffffff'
      },
    },
  },
});
