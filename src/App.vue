<template>
  <div class="container-fluid px-0 px-sm-2" style="margin: auto; max-width: 750px">
    <div class="mb-4">
      <blockquote class="blockquote text-right">
        <p class="mb-0 small"><em>Айгерімге тест жаттауға көмектесу үшін жасалған сайт ;)</em></p>
        <!--<footer class="blockquote-footer">Сайт авторы <cite title="Daulet Ra">Даулет Ра</cite></footer>-->
      </blockquote>
    </div>

    <div class="mb-4">
      <div class="h6" style="color: darkslateblue">Burnoe.com</div>
      <div>Тест сұрақтарын экзаменде отырғандай өтіп</div>
      <ul class="fa-ul">
        <li>
          <span class="fa-li"><font-awesome-icon :icon="['far', 'clock']" /></span>
          кез келген уақытта
        </li>
        <li>
          <span class="fa-li"><font-awesome-icon icon="bus" /></span>
          кез келген жерде
        </li>
        <li>
          <span class="fa-li"><font-awesome-icon icon="mobile-alt" /></span>
          компьютер, планшет немесе смартфонда ашып
        </li>
        <li>
          <span class="fa-li"><font-awesome-icon :icon="['far', 'thumbs-up']" /></span>
          жылдам жаттап алу
        </li>
      </ul>
      <div>
        Администратор:
        <ul class="fa-ul">
          <li>
            <span class="fa-li"><font-awesome-icon style="color: blue" :icon="['fab', 'vk']" /></span>
            <a href="https://vk.com/burnoetest" target="_blank">vk.com/dauletra</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="mb-4 ">

      <div v-if="Object.keys(quizBank).length === 0" class="p-2 border rounded">
        <form v-on:submit.prevent>
          <div class="">
            <div class="text-muted">
              Мысал ретінде <code v-on:click="autoComplete('istoria')">istoria</code> немесе
              <code v-on:click="autoComplete('termo')">termo</code> деп жазып көруге болады
            </div>
            <div class="input-group" style="max-width: 300px">
              <div class="input-group-prepend">
                <span class="input-group-text">Код:</span>
              </div>
              <input v-model.trim="code" type="text" class="form-control">
              <div class="input-group-append">
                <button v-bind:disabled="downloading" v-on:click="download" type="submit" class="btn">Ашу</button>
              </div>
            </div>
            <span class="text-warning small">{{codeWarning}}</span>
            <span class="text-success small">{{codeSuccess}}</span>
            <div v-if="lastCodes.length > 0" class="">
              <span class="text-muted">Соңғы кодтар</span>
              <ul>
                <li v-for="code in lastCodes"><code v-on:click="autoComplete(code)">{{code}}</code></li>
              </ul>
            </div>
          </div>

          <div class="hr-sect">Тек админ үшін</div>

          <div class="">
            <div class="">
              <input v-on:change="onChangeHandler" type="file" class="form-control-file from-control" id="file">
            </div>
            <span class="text-warning small">{{fileWarning}}</span>
            <span class="text-success small">{{fileSuccess}}</span>
          </div>
        </form>
      </div>

      <div v-else class="border rounded">
        <div class="text-right">
          <button v-on:click="quizBank = {}" class="btn btn-link">жабу</button>
        </div>
        <Opener v-if="Object.keys(quizBank).length > 0" v-bind:quizBank="quizBank" />
      </div>
    </div>

    <!-- HOW TO -->

    <!-- FOOTER -->
    <div class="">
      <div class="text-center">Бурное 2018</div>
      <div class="text-center"><a href="mailto:daulet.rakhmankul@gmail.com">daulet.rakhmankul@gmail.com</a></div>
      <div class="text-right small">version 0.01</div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import Opener from './components/Opener'

  export default {
    name: 'app',
    data () {
      return {
        quizBank: {},

        code: '',
        codeWarning: '',
        codeSuccess: '',
        downloading: false,

        fileWarning: '',
        fileSuccess: ''
      }
    },
    components: {
      Opener
    },
    watch: {
      quizBank: function(newVal) {
        if (Object.keys(newVal).length > 0) {
          window.document.title = `${newVal.name} - тест жаттауға арналған сайт`;
        } else {
          window.document.title = 'Тест жаттауға арналған сайт - burnoe.com';
        }
      }
    },
    computed: {
      lastCodes: {
        get: function() {
          let rawCodes = localStorage.getItem('codes');
          return JSON.parse(rawCodes) || [];
        },
        set: function(newValue) {
          let codes = JSON.parse(localStorage.getItem('codes')) || [];
          if (codes.indexOf(newValue) !== -1)
            return;
          if (codes.length > 4) codes.shift();
          codes.push(newValue);
          localStorage.setItem('codes', JSON.stringify(codes));
        }
      }
    },
    methods: {
      autoComplete(code) {
        this.code = code;
      },
      download() {
        this.code = this.code.toLowerCase();
        if (!this.code.length > 0)
          return;
        this.lastCodes = this.code;
        let url = `http://res.cloudinary.com/burnoe/raw/upload/tests/${this.code}.json`;
        console.log(`Generated url: ${url}`);
        // todo adblock блокирует ссылку
        this.downloading = true;
        axios.get(url, {
          onDownloadProgress: event => {
            // this.progress = event.loaded; Math.round((event.loaded*100) / event.total); // event.total == 0
          }
        })
          .then(response => {
            this.quizBank = response.data;

            this.codeWarning = '';
            this.codeSuccess = 'Сәтті жүктелді';
            this.downloading = false;
          })
          .catch(ex => {
            console.log('Файлды серверден жүктеу кезінде қате кетті: ', ex);
            if (ex.request.status === 404) {
              this.codeWarning = 'Код дұрыс емес';
            } else {
              this.codeWarning = 'Интернет қосулы емес немесе AdBlock қосымшасы сайттың жұмысына кедергі жасап жатыр'
            }
            this.codeSuccess = '';
            this.downloading = false;
          });
      },
      onChangeHandler(evt) {
        let files = evt.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
          try {
            this.quizBank = JSON.parse(event.target.result);
            this.fileWarning = '';
            this.fileSuccess = 'Сәтті жүктелді'
          } catch (err) {
            console.log('Файл жүктеу кезінде қате кетті', err);
            this.fileWarning = 'Файл форматы дұрыс емес';
            this.fileSuccess = ''
          }
        };
        reader.readAsText(file);
      }
    }
  }
</script>

<style>
  .hr-sect {
    display: flex;
    flex-basis: 100%;
    align-items: center;
    color: rgba(0, 0, 0, 0.35);
    margin: 8px 0px;
  }
  .hr-sect::before,
  .hr-sect::after {
    content: "";
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.35);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 8px;
  }
  blockquote {
    border-left: 10px solid #ccc;
  }
</style>
