<template>
  <div class="container-fluid px-0 px-sm-2" style="margin: auto; max-width: 750px">

    <div class="border mb-4 p-1">
      Айгерімге тест жаттауға көмектесу үшін жасалған сайт ;)
    </div>

    <div v-if="Object.keys(quizBank).length === 0" class="mb-4 p-2 border rounded">
      <form v-on:submit.prevent>
        <div class="">
          Код (мысалы <code v-on:click="autoComplete('istoria')">istoria</code> немесе
          <code v-on:click="autoComplete('termo')">termo</code> деп жазып көруге болады)

          <div class="input-group" style="max-width: 300px">
            <input v-model.trim="code" type="text" class="form-control" placeholder="Код">
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
    computed: {
      lastCodes: {
        get: function() {
          let rawCodes = localStorage.getItem('codes');
          return JSON.parse(rawCodes) || [];
        },
        set: function(newValue) {
          let codes = JSON.parse(localStorage.getItem('codes')) || [];
          if (codes.includes(newValue))
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
</style>
