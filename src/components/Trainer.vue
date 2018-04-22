<template>
    <div class="border border-primary">

      <div class="border" style="max-width: 500px">
        <table class="table table-sm">
          <tr>
            <td>Тесттің коды</td>
            <td>{{quizBank.name}}</td>
          </tr>
          <tr>
            <td>Сұрақтар саны</td>
            <td>{{quizBank.quizes.length}}</td>
          </tr>
          <tr>
            <td>Табылмаған сұрақтар номерлері</td>
            <td>{{missingQuestions}}</td>
          </tr>
          <tr>
            <td>Жасалған күні</td>
            <td>{{formatDate(quizBank.created_time)}}</td>
          </tr>
        </table>
      </div>

      <div class="border my-1 p-sm-2">
        <div class="form-group">
          <div class="form-check-inline">
            <input v-model="mode" class="form-check-input" type="radio" id="showMode" value="show">
            <label for="showMode" class="form-check-label">Көрсету</label>
          </div>
          <div class="form-check-inline">
            <input v-model="mode" class="form-check-input" type="radio" id="examMode" value="exam">
            <label for="examMode" class="form-check-label">Тестілеу</label>
          </div>
        </div>
        <div class="form-group row no-gutters">
          <label for="numbers" class="col-4 col-form-label">Сұрақтар номерлері
            <span style="white-space:nowrap">({{Math.min(...quizNumbers) + "-" + Math.max(...quizNumbers)}})</span>
          </label>
          <div class="col">
            <input v-model="rawNumbers" type="text" class="form-control" id="numbers" placeholder="1-10 23 29 56-70">
            <span class="small text-muted">{{this.inputNumbers}}</span>
          </div>
        </div>
        <div v-if="mode==='exam'" class="text-muted">
          <h6>Ереже</h6>
          <ul>
            <li>Сұраққа қате жауап берсең, сол сұрақ қайтадан келеді</li>
            <li>Жауаптың үстінен екі рет бассаң жауап тексеріледі</li>
          </ul>
        </div>
        <div class="form-group text-center">
          <button v-if="mode==='exam'" v-on:click="start" type="submit" class="btn ">Бастау</button>
        </div>
      </div>

      <div class="border p-sm-2">
        <div v-if="mode==='exam'" class="">
          <Exam v-if="examNumbers.length > 0" v-bind:quizBank="quizBank" v-bind:examNumbers="examNumbers" />
        </div>

        <div v-else-if="mode==='show'" class="border">
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
      </div>

    </div>
</template>

<script>
  import Exam from './Exam'

  const range = (raw) => {
    let [start, end] = raw.split("-").map((e) => Number(e));
    return Array.from({length: (end-start+1)}, (v, k) => k + start);
  };

  export default {
    name: "trainer",
    components: {
      Exam
    },
    props: ["quizBank"],
    data() {
      return {
        mode: 'exam',
        rawNumbers: '1-25',
        examNumbers: []
      }
    },
    computed: {
      currentQuizes() {
        return this.quizBank.quizes.filter((quiz) => this.inputNumbers.includes(quiz.number) );
      },
      quizNumbers() {
        return this.quizBank.quizes.map((quiz) => quiz.number) //.sort((a, b) => a - b);
      },
      inputNumbers() {
        let regpat = /\d{1,3}-\d{1,3}|\d{1,3}/g;
        let numbers = [];
        let match;
        while (match = regpat.exec(this.rawNumbers)) {
          if (match[0].indexOf('-') === -1) {
            numbers.push(Number(match[0]));
          }
          else {
            numbers.push(...range(match[0]));
          }
        }
        return numbers.filter((n) => this.quizNumbers.includes(n));
      },
      missingQuestions() {
        console.log(`Quiz Numbers: ${this.quizNumbers.length}`);
        let fullNumbers = [];
        for(let i = Math.min(...this.quizNumbers); i <= Math.max(...this.quizNumbers); i++) {
          fullNumbers.push(i);
        }
        console.log(`Full Numbers: ${fullNumbers.length}`);
        return fullNumbers.filter((n) => {
          return this.quizNumbers.indexOf(n) === -1;
        }).toString();
      }
    },
    watch: {
      mode(val, oldVal) {
        if (val === 'show')
          this.examNumbers = [];
        else if (val === 'exam')
          this.examNumbers = [...this.inputNumbers];
      }
    },
    methods: {
      start() {
        this.examNumbers = [...this.inputNumbers];
      },
      formatDate(microseconds) {
        let datetime = new Date(microseconds * 1000);
        let dd = datetime.getDate();
        if (dd < 10) dd = '0' + dd;
        let mm = datetime.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        let yyyy = datetime.getFullYear();
        let H = datetime.getHours();
        let M = datetime.getMinutes();
        if (M < 10) M = '0' + M;
        return `${dd}-${mm}-${yyyy} ${H}:${M}`;
      }
    }
  }
</script>

<style scoped>

</style>
