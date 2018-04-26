<template>
  <div class="">
    <div class="text-right text-muted">
      <input v-model="state.showLetter" type="checkbox" id="showLetterId">
      <label for="showLetterId">Әріптер</label>
    </div>
    <div class="" style="overflow:hidden; white-space: nowrap;">
      Қалған сұрақтар саны: {{localExamNumbers.length}}
      <transition-group name="list" tag="p">
        <span v-for="item in localExamNumbers" v-bind:key="item[1]" class="list-item">
          {{ item[0] }}
        </span>
      </transition-group>
    </div>
    <div v-if="localExamNumbers.length === 0" class="alert alert-success">
      Сұрақтар бітті
    </div>
    <div v-hammer:swipe.left="nextQuestion">
      <div v-html="quiz.question"></div>

      <div v-for="answer in quiz.answers">
        <span v-bind:class="[answer.value === 10 ? 'text-success' : 'text-danger', 'font-weight-bold']">{{answer.spoiler}}</span>
        <div v-on:dblclick="checkAnswer" class="form-check-inline">
          <input v-model="answerCode" class="form-check-input" type="radio" v-bind:value="answer.value" v-bind:id="'answer'+answer.value">
          <label v-bind:for="'answer'+answer.value" v-html="answer.text" class="form-check-label"></label>
        </div>
      </div>
    </div>

    <div class="text-right">
      <button v-on:click="checkAnswer" v-bind:disabled="state.checked || !answerCode" type="button" class="btn btn-secondary">Тексеру</button>
      <button v-on:click="nextQuestion" type="button" class="btn btn-success">Келесі</button>
    </div>
  </div>
</template>

<script>

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  export default {
    name: "exam",
    props: ["quizBank", "examNumbers"],
    data() {
      return {
        localExamNumbers: [...this.examNumbers],
        quiz: {},
        currentNumber: '',
        answerCode: '',
        state: {
          checked: false,
          showLetter: false
        }
      }
    },
    watch: {
      examNumbers(newVal) {
        this.localExamNumbers = [...newVal];
        this.nextQuestion();
      }
    },
    created() {
      this.nextQuestion();
    },
    methods: {
      // todo приветствие и завершение
      nextQuestion() {
        if (this.localExamNumbers.length === 0){
          return;
        }
        let index = Math.floor(Math.random() * this.localExamNumbers.length);
        this.currentNumber = this.localExamNumbers[index][0];
        let quiz = this.quizBank.quizes.filter(q => q.number === this.currentNumber)[0];
        let answers = [];
        quiz.answers.forEach((answer, index) => {
          if (!this.state.showLetter)
            answer = answer.slice(answer.indexOf(')')+1);
          answers.push({
            text: answer, //.slice(answer.indexOf(')')+1),
            value: index + 10,
            spoiler: ''
          })
        });
        quiz.fakeanswers.forEach((answer, index) => {
          if (!this.state.showLetter)
            answer = answer.slice(answer.indexOf(')')+1);
          answers.push({
            text: answer, //.slice(answer.indexOf(')')+1),
            value: index + 20,
            spoiler: ''
          })
        });
        this.answerCode = '';
        this.state.checked = false;
        this.quiz = {};
        this.quiz.question = quiz.question;
        this.quiz.answers = shuffleArray(answers);
      },
      checkAnswer() {
        if (this.state.checked) return;
        this.state.checked = true;
        if (this.answerCode === 10) {
          let tempNum = this.localExamNumbers.find(x => x[0] === this.currentNumber);
          this.localExamNumbers.splice(this.localExamNumbers.indexOf(tempNum), 1);
        } else {
          this.localExamNumbers.push([this.currentNumber, Math.random()]);
        }
        this.quiz.answers.map(answer => {
          if (answer.value === this.answerCode)
            answer.spoiler = 'Қате';
          if (answer.value === 10)
            answer.spoiler = 'Дұрыс';
          return answer;
        })
      }
    }
  }
</script>

<style scoped>
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
</style>
