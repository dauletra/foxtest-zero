<template>
  <div class="container border">


    <div class="border mb-4 p-1">
      <form v-on:submit.prevent class="form-inline">
        <div class="form-group">
          <input v-on:change="onChangeHandler" type="file" class="form-control-file from-control" id="file">
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Жүктеу</button>
        </div>
      </form>
    </div>

    <Trainer v-if="Object.keys(quizBank).length > 0" v-bind:quizBank="quizBank" />

  </div>
</template>

<script>
  import Trainer from './components/Trainer'

  export default {
    name: 'app',
    data () {
      return {
        quizBank: {}
      }
    },
    components: {
      Trainer
    },
    methods: {
      hello() {
        console.log()
      },
      onChangeHandler(evt) {
        let files = evt.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
          this.quizBank = JSON.parse(event.target.result);
          console.log('QuizBank successfilly parsed: ' + this.quizBank.name);
          console.log(this.quizBank);
        };
        reader.readAsText(file);
      }
    }
  }
</script>

