<template>
  <div class="container border">

    <div class="border mb-4 p-1">
      Студенттерге тест жаттауға көмектесетін сайт
    </div>

    <div class="mb-4 p-2 border rounded">
      <form v-on:submit.prevent>

        <div class="">
          Код жазу арқылы серверден жүктеу
          <div class="input-group" style="max-width: 300px">
            <input v-model.trim="code" type="text" class="form-control" placeholder="Код">
            <div class="input-group-append">
              <button v-bind:disabled="downloading" v-on:click="download" type="submit" class="btn">Жүктеу</button>
            </div>
          </div>
          <span class="text-warning small">{{codeWarning}}</span>
          <span class="text-success small">{{codeSuccess}}</span>
        </div>

        <div class="hr-sect">немесе</div>

        <div class="">
          Компьютер немесе телефон жадынан жүктеу
          <div class="">
            <input v-on:change="onChangeHandler" type="file" class="form-control-file from-control" id="file">
          </div>
          <span class="text-warning small">{{fileWarning}}</span>
          <span class="text-success small">{{fileSuccess}}</span>
        </div>

      </form>
    </div>

    <Trainer v-if="Object.keys(quizBank).length > 0" v-bind:quizBank="quizBank" />

  </div>
</template>

<script>
  import axios from 'axios'
  import Trainer from './components/Trainer'

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
      Trainer
    },
    methods: {
      download() {
        this.code = this.code.toLowerCase();
        if (!this.code.length > 0)
          return;
        let url = `https://dauletra.github.io/foxtestconsole/examples/${this.code}.json`;
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
            this.codeWarning = 'Код дұрыс емес';
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
