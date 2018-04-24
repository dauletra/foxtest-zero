<template>
  <div class="border">
    <div v-for="quiz in currentQuizes" class="border">
      <div v-html="quiz.question"></div>
      <div v-html="quiz.answers[0]" class="border border-success"></div>
      <div v-html="quiz.fakeanswers[0]"></div>
      <div v-html="quiz.fakeanswers[1]"></div>
      <div v-html="quiz.fakeanswers[2]"></div>
      <div v-html="quiz.fakeanswers[3]"></div>
      <div v-html="quiz.fakeanswers[4]"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shower",
    props: ['quizBank', 'inputNumbers'],
    computed: {
      currentQuizes() {
        return this.quizBank.quizes.filter(quiz => this.inputNumbers.includes(quiz.number));
      }
    }
  }
</script>

<style scoped>

</style>
