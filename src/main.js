import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import Hammer from 'hammerjs'
import { isEmpty } from 'lodash'
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import BackToTop from 'vue-backtotop'

import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faBus from '@fortawesome/fontawesome-free-solid/faBus'
import faMobileAlt from '@fortawesome/fontawesome-free-solid/faMobileAlt'
import faArrowRight from '@fortawesome/fontawesome-free-solid/faArrowRight'
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'
import faUserSecret from '@fortawesome/fontawesome-free-solid/faUserSecret'
import faListUl from '@fortawesome/fontawesome-free-solid/faListUl'
import faBold from '@fortawesome/fontawesome-free-solid/faBold'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faUserBlack from '@fortawesome/fontawesome-free-solid/faUser'
import faAngleDoubleLeft from '@fortawesome/fontawesome-free-solid/faAngleDoubleLeft'
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp'

import faClock from '@fortawesome/fontawesome-free-regular/faClock'
import faThumbsUp from '@fortawesome/fontawesome-free-regular/faThumbsUp'
import faUser from '@fortawesome/fontawesome-free-regular/faUser'
import faFileWord from '@fortawesome/fontawesome-free-regular/faFileWord'
import faLightbulb from '@fortawesome/fontawesome-free-regular/faLightbulb'
import faCircle from '@fortawesome/fontawesome-free-regular/faCircle'
import faHandPeace from '@fortawesome/fontawesome-free-regular/faHandPeace'
import faHandPointUp from '@fortawesome/fontawesome-free-regular/faHandPointUp'

import faVk from '@fortawesome/fontawesome-free-brands/faVk'
import faWhatsapp from '@fortawesome/fontawesome-free-brands/faWhatsapp'

fontawesome.library.add(
  faSpinner, faBus, faMobileAlt, faArrowRight, faArrowLeft, faKey, faUserSecret, faListUl, faBold, faTimes, faUserBlack,
  faAngleDoubleLeft, faChevronUp,
  faClock, faThumbsUp, faUser, faFileWord, faLightbulb, faCircle, faHandPeace, faHandPointUp,
  faVk, faWhatsapp);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);


const gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe', 'doubletap']
const directions = ['up', 'down', 'left', 'right', 'horizontal', 'vertical', 'all']

const VueHammer = {
  config: {},
  customEvents: {},
  install: function(Vue) {
    const that = this
    Vue.directive('hammer', {
      bind(el, binding) {
        if (!el.hammer) {
          el.hammer = new Hammer.Manager(el)
        }
        const mc = el.hammer

        // determine event type
        const event = binding.arg
        if (!event) {
          console.warn('[vue-hammer] event type argument is required.')
        }
        that.config[event] = {}

        const direction = binding.modifiers
        if (!isEmpty(direction)) {
          Object.keys(direction).map(keyName => {
            that.config[event].direction = String(keyName)
          })
        }

        let recognizerType, recognizer

        if (that.customEvents[event]) {
          // custom event
          const custom = that.customEvents[event]
          recognizerType = custom.type
          recognizer = new Hammer[that.capitalize(recognizerType)](custom)
          recognizer.recognizeWith(mc.recognizers)
          mc.add(recognizer)
        } else {
          // built-in event
          recognizerType = gestures.find(gesture => gesture === event)
          if (!recognizerType) {
            console.warn('[vue-hammer] invalid event type: ' + event)
            return
          }
          recognizer = mc.get(recognizerType)
          if (!recognizer) {
            // add recognizer
            recognizer = new Hammer[that.capitalize(recognizerType)]()
            // make sure multiple recognizers work together...
            recognizer.recognizeWith(mc.recognizers)
            mc.add(recognizer)
          }
          // apply global options
          const globalOptions = VueHammer.config[recognizerType]
          if (globalOptions) {
            that.guardDirections(globalOptions)
            recognizer.set(globalOptions)
          }
          // apply local options
          const localOptions =
            el.hammerOptions &&
            el.hammerOptions[recognizerType]
          if (localOptions) {
            that.guardDirections(localOptions)
            recognizer.set(localOptions)
          }
        }
      },
      inserted(el, binding) {
        const mc = el.hammer
        const event = binding.arg
        if (mc.handler) {
          mc.off(event, mc.handler)
        }
        if (typeof binding.value !== 'function') {
          mc.handler = null
          console.warn(
            '[vue-hammer] invalid handler function for v-hammer: ' +
            binding.arg
          )
        } else {
          mc.on(event, (mc.handler = binding.value))
        }
      },
      update(el, binding) {
        const mc = el.hammer
        const event = binding.arg
        // teardown old handler
        if (mc.handler) {
          mc.off(event, mc.handler)
        }
        if (typeof binding.value !== 'function') {
          mc.handler = null
          console.warn(
            '[vue-hammer] invalid handler function for v-hammer: ' +
            binding.arg
          )
        } else {
          mc.on(event, (mc.handler = binding.value))
        }
      },
      unbind(el, binding) {
        const mc = el.hammer
        if (mc.handler) {
          el.hammer.off(binding.arg, mc.handler)
        }
        if (!Object.keys(mc.handlers).length) {
          el.hammer.destroy()
          el.hammer = null
        }
      },
    })
  },
  guardDirections(options) {
    var dir = options.direction
    if (typeof dir === 'string') {
      var hammerDirection = 'DIRECTION_' + dir.toUpperCase()
      if (directions.indexOf(dir) > -1 && Hammer.hasOwnProperty(hammerDirection)) {
        options.direction = Hammer[hammerDirection]
      } else {
        console.warn('[vue-hammer] invalid direction: ' + dir)
      }
    }
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
}

Vue.use(VueHammer);
Vue.use(BackToTop);

import 'bootstrap/dist/css/bootstrap.css'

new Vue({
  el: '#app',
  render: h => h(App)
});
