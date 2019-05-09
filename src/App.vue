<template>
  <div class="container-fluid px-0 px-sm-2" style="margin: auto; max-width: 750px">
    <div class="mb-4">
      <blockquote class="blockquote text-right">
        <p class="mb-0 small"><em>Айгерімге тест жаттауға көмектесу үшін жасалған сайт ;)</em></p>
      </blockquote>
    </div>

    <div class="mb-4 p-1">
      <div class="h6" style="color: darkslateblue">test.burnoe.com</div>
      <div>Ттестке дайындалуға арналған сайт</div>
      <ul class="fa-ul">
        <li>
          <span class="fa-li"><font-awesome-icon icon="mobile-alt" style="color: darkolivegreen" /></span>
          компьютермен де, смартфонмен де ашып жаттауға болады
        </li>
      </ul>
    </div>

    <div id="top" class="mb-4">
      <!-- TEST CODE -->
      <div v-if="Object.keys(quizBank).length === 0" class="">
        <form v-on:submit.prevent>
          <div class="p-1 p-sm-0">
            <div class="text-muted">
              Мысал ретінде
              <code v-on:click="code='termo'">termo</code> деп жазып көруге болады
            </div>
            <div class="input-group" style="max-width: 300px">
              <div class="input-group-prepend">
                <span class="input-group-text">Код:</span>
              </div>
              <input v-model.trim="code" type="text" class="form-control">
              <div class="input-group-append">
                <button v-bind:disabled="downloading" v-on:click="download" type="submit" class="btn">
                  <font-awesome-icon v-if="downloading" icon="spinner" spin />
                  <span v-else>Ашу</span>
                </button>
              </div>
            </div>
            <span class="text-warning small">{{codeWarning}}</span>
            <span class="text-success small">{{codeSuccess}}</span>
            <div v-if="lastCodes.length > 0" class="">
              <span class="text-muted">Соңғы кодтар</span>
              <ul class="fa-ul">
                <li v-for="lastCode in lastCodes">
                  <span class="fa-li">
                    <font-awesome-layers>
                      <font-awesome-icon :icon="['far', 'circle']" />
                      <font-awesome-icon icon="bold" transform="shrink-6" />
                    </font-awesome-layers>
                  </span>
                  <code v-on:click="code=lastCode">{{lastCode}}</code>
                  <a v-on:click.prevent="removeFromLastCodes(lastCode)" href="#">
                    <font-awesome-icon icon="times" transform="shrink-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="hr-sect">Тек админ үшін</div>

          <div class="p-1 p-sm-0">
            <div class="">
              <input v-on:change="onChangeHandler" type="file" class="form-control-file from-control" id="file">
            </div>
            <span class="text-warning small">{{fileWarning}}</span>
            <span class="text-success small">{{fileSuccess}}</span>
          </div>
        </form>
      </div>

      <!-- TEST OPENER -->
      <div v-else class="">
        <div class="text-right">
          <button v-on:click="quizBank = {}" class="btn btn-link">жабу</button>
        </div>
        <Opener v-if="Object.keys(quizBank).length > 0" v-bind:quizBank="quizBank" />
      </div>
    </div>

    <back-to-top>
      <font-awesome-icon icon="chevron-up" size="3x" />
    </back-to-top>

    <!-- FOOTER -->
    <div class="">
      <div class="text-center">Бурное 2019</div>
      <div class="text-center">
        <font-awesome-icon style="color: #4c75a3" :icon="['fab', 'vk']" />
        <a href="https://vk.com/dauletra" target="_blank">vk.com/dauletra</a>
      </div>
      <div class="text-center"><a href="mailto:daulet.rakhmankul@gmail.com">daulet.rakhmankul@gmail.com</a></div>
      <div class="text-right small">version 0.04</div>
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
        lastCodes: [],
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
    created() {
      let rawCodes = localStorage.getItem('codes');
      this.lastCodes = JSON.parse(rawCodes) || [];
    },
    methods: {
      addToLastCodes(code) {
        if (this.lastCodes.indexOf(code) !== -1) {
          this.lastCodes.splice(this.lastCodes.indexOf(code), 1);
        }
        if (this.lastCodes.length > 4) {
          this.lastCodes.splice(4);
        }
        this.lastCodes.splice(0, 0, code);
        localStorage.setItem('codes', JSON.stringify(this.lastCodes));
      },
      removeFromLastCodes(code) {
        if (this.lastCodes.indexOf(code) !== -1) {
          this.lastCodes.splice(this.lastCodes.indexOf(code), 1)
        }
        localStorage.setItem('codes', JSON.stringify(this.lastCodes));
      },
      download() {
        this.code = this.code.toLowerCase();
        if (!this.code.length > 0)
          return;
        this.addToLastCodes(this.code);
        let url = `http://res.cloudinary.com/burnoe/raw/upload/tests/${this.code}.json`;
        console.log(`Generated url: ${url}`);
        this.downloading = true;
        axios.get(url)
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
