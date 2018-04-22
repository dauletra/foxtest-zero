<template>
  <div class="">
    <div class="" style="overflow:auto; white-space: nowrap;">
      Қалған сұрақтар саны: {{examNumbers.length}} ({{examNumbers.join(', ')}})
    </div>
    <div v-if="Object.keys(quiz).length > 0" class="">
      <div v-html="quiz.question"></div>

      <div v-for="answer in quiz.answers">
        <span v-bind:class="[answer.value === 10 ? 'text-success' : 'text-danger', 'font-weight-bold']">{{answer.spoiler}}</span>
        <div v-on:dblclick="checkAnswer" class="form-check-inline">
          <input v-model="answerCode" class="form-check-input" type="radio" v-bind:value="answer.value" v-bind:id="'answer'+answer.value">
          <label v-bind:for="'answer'+answer.value" v-html="answer.text" class="form-check-label"></label>
        </div>
      </div>

    </div>
    <div v-else>
      Нажмите кнопку следующий или начните сначало
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
        quiz: {},
        currentNumber: '',
        answerCode: '',
        state: {
          checked: false
        }
      }
    },
    created() {
      this.nextQuestion();
    },
    methods: {
      // todo приветствие и завершение
      nextQuestion() {
        let index = Math.floor(Math.random() * this.examNumbers.length);
        this.currentNumber = this.examNumbers[index];
        let quiz = this.quizBank.quizes.filter(q => q.number === this.currentNumber)[0];
        let answers = [];
        quiz.answers.forEach((answer, index) => {
          answers.push({
            text: answer.slice(answer.indexOf(')')+1),
            value: index + 10,
            spoiler: ''
          })
        });
        quiz.fakeanswers.forEach((answer, index) => {
          answers.push({
            text: answer.slice(answer.indexOf(')')+1),
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
          this.examNumbers.splice(this.examNumbers.indexOf(this.currentNumber), 1);
        } else {
          this.examNumbers.push(this.currentNumber);
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

</style>
