<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable max-len -->
<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div id="app">
    <div class="container">
      <div class="row p-5">
        <div class="col-12 col-md-7">
            <h2><font-awesome-icon icon="fa-solid fa-clipboard" class="d-inline-block me-3 fa-clipboard" />看護記録</h2>
            <div class="my-2">
                <span class="p-2">年齢：<input type="text" class="p-1 form-control d-inline" style="width: 30px;" pattern="^[0-9]+$" required>歳</span>
                <span class="p-2">性別：
                    <select name="" id="" required class="p-1 form-control d-inline" style="width: 50px">
                        <option value="">男性</option>
                        <option value="">女性</option>
                    </select>
                </span>
                <span class="p-2">病歴：喘息（完治）</span>
            </div>
            <table class="soap-table">
                <tr>
                    <th class="text-center border-top">
                        Subjective
                        <small class="text-muted d-block">主観的情報</small>
                    </th>
                    <td>
                        <label for="subjective"></label>
                        <textarea v-model="subjective" class="suggest" type="textarea" name="subjective" autocomplete="on" list="food"/>
                        <div v-if="evaluate.subjective">
                            <div v-for="subjective in evaluate.subjective" :key="subjective.index" :class="[subjective.score >= 0.5 ? 'score-good' : 'score-bad']">
                                <font-awesome-icon v-if="subjective.score >= 0.5" icon="fa-regular fa-circle-check" class="fa-circle-check"/>
                                <font-awesome-icon v-if="subjective.score < 0.5" icon="fa-solid fa-triangle-exclamation" class="a-triangle-exclamation"/>
                                {{ subjective.input }}   <span :class="[subjective.score >= 0.5 ? 'text-primary' : 'text-danger']">{{ Math.round(subjective.score*100) }}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th class="text-center">
                    Objective
                    <small class="text-muted d-block">客観的情報</small>
                </th>
                <td>
                    <label for="objective"></label>
                    <textarea v-model="objective" class="suggest" type="textarea" name="objective" autocomplete="on" list="food"/>
                    <div v-if="evaluate.objective">
                        <div v-for="objective in evaluate.objective" :key="objective.index" :class="[objective.score >= 0.5 ? 'score-good' : 'score-bad']">
                            <font-awesome-icon v-if="objective.score >= 0.5" icon="fa-regular fa-circle-check" class="fa-circle-check"/>
                            <font-awesome-icon v-if="objective.score < 0.5" icon="fa-solid fa-triangle-exclamation" class="a-triangle-exclamation"/>
                            {{ objective.input }}   <span :class="[objective.score >= 0.5 ? 'text-primary' : 'text-danger']">{{ Math.round(objective.score*100) }}%</span></div>
                    </div>
                </td>
                </tr>
                <tr>
                    <th class="text-center">
                        Assessment
                        <small class="text-muted d-block">評価</small>
                    </th>
                    <td>
                        <textarea v-model="assessment" class="suggest"  name="assessment" autocomplete="on" list="food" />
                        <div v-if="evaluate.recommendation" >
                            <font-awesome-icon @click="copyToClipboard(evaluate.recommendation.assessment)" icon="fa-regular fa-copy" data-bs-toggle="tooltip" data-bs-placement="top" :title="copy"/>
                            {{ evaluate.recommendation.assessment }}</div>
                    </td>
                </tr>
                <tr>
                <th class="text-center">
                    Plan
                    <small class="text-muted d-block">計画（治療）</small>
                </th>
                <td>
                    <textarea v-if="evaluate.recommendation" class="suggest"  name="plan" autocomplete="on" list="food" :value="evaluate.recommendation.plan" />
                    <textarea v-if="!evaluate.recommendation" class="suggest" ></textarea>
                </td>
                </tr>
            </table>
            <div class="d-flex justify-content-between mt-3 mb-5">
                <button class="btn btn-primary font-weight-bold" @click=getEvaluate()><font-awesome-icon icon="fa-solid fa-magnifying-glass" class="me-2" />SO採点・AP検索</button>
                <button class="btn btn-primary font-weight-bold" @click=postFeedback()><font-awesome-icon icon="fa-brands fa-line" class="me-2" />フィードバックをもらう</button>
            </div>
        </div>
        <div class="col-12 col-md-5 mb-5">
          <div >
            <h2><font-awesome-icon icon="fa-solid fa-file-lines" class="d-inline-block me-3 fa-file-lines" />参考</h2>
            <div v-if="evaluate.guideline" class="accordion m-0 w-100" id="guidlineAccordion">
                <div v-for="(guideline, index) in evaluate.guideline" :key="guideline.index" class="accordion-item">
                <h3 class="accordion-header" :id="'heading'+index">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+index" aria-expanded="false" :aria-controls="'collapse'+index">
                        キーワード：{{ guideline.category }}
                    </button>
                </h3>
                <div :id="'collapse'+index" class="accordion-collapse collapse" :aria-labelledby="'heading'+index" data-bs-parent="#guidlineAccordion">
                    <div class="accordion-body">
                      <iframe title="test" class="w-100" :src="guideline.url"></iframe>
                      <a :href="guideline.url">もっと見る</a>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>
        <div class="col-12">
            <h2><font-awesome-icon icon="fa-solid fa-user-nurse"  class="d-inline-block me-3 fa-user-nurse" />もらったフィードバック</h2>
            <div class="border border-info rounded p-2 py-md-3 px-md-5">
                <table class="w-100">
                <tr class="border-bottom" v-for="(feedback_comment) in feedback.feedback_comments" :key="feedback_comment.index">
                <th class="p-2 w-25">{{ feedback_comment.name}}さん<font-awesome-icon icon="fa-solid fa-user-nurse"  class="d-inline-block ms-1 ms-md-3" /></th>
                <td class="p-2 w-75">{{ feedback_comment.feedback_comment}}</td>
                </tr>
            </table>
            </div>
        </div>
      </div>
    </div>
    <div
      class="flash alert alert-primary position-fixed"
      v-if="show === true"
    >
    FBをLineで送信しました
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'App',
  props: {
    msg: String,
  },
  components: {
  },
  data() {
    return {
      feedback: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      evaluate: '',
      show: false,
      isOpen: false,
      copy: 'コピーします',
    };
  },
  methods: {
    open() {
      this.isOpen = !this.isOpen;
    },
    getEvaluate() {
      axios
        .post('https://soap-record-support-server-fae3im6i6q-an.a.run.app/api/v1/soap-record-support/evaluate', {
          department: 'string',
          sex: 'string',
          age: 0,
          subjective: this.subjective,
          objective: this.objective,
        })
        // eslint-disable-next-line no-return-assign
        .then((response) => (
          this.evaluate = response.data
        ));
    },
    getFeedback() {
      axios
        .get('https://soap-record-support-server-fae3im6i6q-an.a.run.app/api/v1/soap-record-support/feedback')
      // eslint-disable-next-line no-return-assign
        .then((response) => (
          this.feedback = response.data
        ));
    },
    postFeedback() {
      axios
        .post('https://soap-record-support-server-fae3im6i6q-an.a.run.app/api/v1/soap-record-support/feedback', {
          department: 'string',
          sex: 'string',
          age: 0,
          subjective: this.subjective,
          objective: this.objective,
          assessment: this.assessment,
          plan: this.plan,
        })
        // eslint-disable-next-line no-return-assign
        .then((response) => (
          this.evaluate = response.data
        ));
      this.show = true;
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.copy = 'コピーしました';
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
  mounted() {
    setInterval(this.getFeedback(), 2000);
    setInterval(() => {
      this.getFeedback();
    }, 5000);
  },
  // Vueインスタンスに変化があったら発動する
  updated() {
    // setTimeoutで3000ms後にshowをfalseにする
    setTimeout(
      () => {
        this.show = false;
      },
      5000,
    );
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Shippori+Mincho:wght@700;800&display=swap');
    #app {
    font-family: "Google Sans Display","Roboto","Arial",sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    }
    h2 {
        font-weight: 700;
        font-size: 1.8rem;
        text-align: center;
    }
  .soap-table{
    border-collapse:collapse;
    margin:0 auto;
    width: 100%;
  }
  .soap-table th{
    border-bottom:1px solid #e5e5e5;
    height: 80px;
    width: 65px;
    padding: 10px;
  }
  .suggest {
    width: 100%;
    border: none;
    height: 80px;
  }
  .flash {
    text-align: center;
    height: auto;
    top: 0%;
    position: absolute;
    width: 100%;
}

@keyframes open {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.accordion-body {
    height: 470px;
}

iframe {
    height: 400px;
}

.fa-clipboard {
    color: rgb(16, 107, 77);
}

.fa-file-lines {
    color: rgb(238, 183, 32);
}
.fa-user-nurse {
    color: rgb(173, 43, 124);
}
.fa-triangle-exclamation {
    color: red;
    padding-left: 7px;
    padding-right: 3px;
}
.fa-circle-check {
    color: blue;
    padding-left: 7px;
    padding-right: 3px;
}

.score-good {
    background: aliceblue;

}

.score-bad {
    background: antiquewhite;
}
</style>
