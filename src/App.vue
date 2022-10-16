<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable max-len -->
<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row p-5">
        <div class="col-12 col-md-7">
            <h2><font-awesome-icon icon="fa-solid fa-clipboard" class="d-inline-block me-3 fa-clipboard" />看護記録</h2>
            <div class="my-2">
                <span class="p-2">年齢：<input v-model="age" type="text" class="p-1 form-control d-inline" style="width: 30px;" pattern="^[0-9]+$" required>歳</span>
                <span class="p-2">性別：
                    <select v-model="sex" name="" id="" required class="p-1 form-control d-inline" style="width: 50px">
                        <option value="男性">男性</option>
                        <option value="女性">女性</option>
                    </select>
                </span>
                <span class="p-2">診療科：
                    <select v-model="department" name="" id="" required class="p-1 form-control d-inline" style="width: 100px">
                        <option value="内科">内科</option>
                        <option value="外科">外科</option>
                        <option value="小児科">小児科</option>
                        <option value="産婦人科">産婦人科</option>
                        <option value="精神科">精神科</option>
                    </select>
                </span>
            </div>
            <table class="soap-table">
                <tr>
                    <th class="text-center border-top">
                        Subjective
                        <small class="text-muted d-block">主観的情報</small>
                    </th>
                    <td>
                        <label for="subjective"></label>
                        <textarea v-model="subjective" class="suggest" type="textarea" name="subjective" />
                        <div class="font-small" v-if="evaluate.subjective">
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
                    <textarea v-model="objective" class="suggest" type="textarea" name="objective" />
                    <div class="font-small" v-if="evaluate.objective">
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
                        <textarea v-model="assessment" class="suggest"  name="assessment" />
                        <div class="copy-bg" v-if="evaluate.recommendation" @click="copyToClipboardAssessment(evaluate.recommendation.assessment)" >
                            <div class="copy-msg" v-if="copyMsgShowAssessment === true">
                                <small><font-awesome-icon icon="fa-regular fa-copy" class="pe-2" />コピーしました</small>
                            </div>
                            <a class="block font-small">
                            <font-awesome-icon icon="fa-regular fa-copy" data-bs-toggle="tooltip" data-bs-placement="top" :title="copy"/>
                            {{ evaluate.recommendation.assessment }}
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                <th class="text-center">
                    Plan
                    <small class="text-muted d-block">計画（治療）</small>
                </th>
                <td>
                    <textarea v-model="plan" class="suggest" name="plan" />
                    <div class="copy-bg" v-if="evaluate.recommendation"  data-bs-toggle="tooltip" data-bs-placement="top" :title="copy">
                        <div class="copy-msg" v-if="copyMsgShowPlan === true">
                            <small><font-awesome-icon icon="fa-regular fa-copy" class="pe-2" />コピーしました</small>
                        </div>
                        <a class="block font-small" @click="copyToClipboardPlan(evaluate.recommendation.plan)" >
                        <font-awesome-icon icon="fa-regular fa-copy"/>
                        {{ evaluate.recommendation.plan }}
                        </a>
                    </div>
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
            <div v-if="evaluate.guideline" class="mt-5 accordion m-0 w-100" id="guidlineAccordion">
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
        <div class="col-12" v-if="feedbackShow === true">
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
      v-if="flashMsgShow === true"
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
      department: '内科',
      sex: '男性',
      age: '25',
      feedback: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      evaluate: '',
      flashMsgShow: false,
      isOpen: false,
      copy: 'コピーします',
      feedbackShow: false,
      copyMsgShowPlan: false,
      copyMsgShowAssessment: false,
    };
  },
  methods: {
    open() {
      this.isOpen = !this.isOpen;
    },
    getEvaluate() {
      axios
        .post('https://soap-record-support-server-fae3im6i6q-an.a.run.app/api/v1/soap-record-support/evaluate', {
          department: this.department,
          sex: this.sex,
          age: this.age,
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
          department: this.department,
          sex: this.sex,
          age: this.age,
          subjective: this.subjective,
          objective: this.objective,
          assessment: this.assessment,
          plan: this.plan,
        });
      this.flashMsgShow = true;
      this.feedbackShow = true;
    },
    copyToClipboardPlan(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.copyMsgShowPlan = true;
          setTimeout(
            () => {
              this.copyMsgShowPlan = false;
            },
            2000,
          );
        })
        .catch((e) => {
          console.error(e);
        });
    },
    copyToClipboardAssessment(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.copyMsgShowAssessment = true;
          setTimeout(
            () => {
              this.copyMsgShowAssessment = false;
            },
            2000,
          );
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
        this.flashMsgShow = false;
      },
      10000,
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
    animation: fadein-keyframes 2s ease 0.2s 1 forwards;
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

.copy-bg{
    background: rgb(244, 254, 229);
    position: relative;
}
.copy-bg:hover{
    font-weight: bold;
}
.copy-bg:active{
    background: rgb(220, 247, 179);
    font-weight: bold;
}

@keyframes fadein-keyframes {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

.copy-msg {
  padding: 4px 7px;
  position:absolute;
  top: 10px;
  left: 30px;
  min-width: 120px;
  max-width: 100%;
  color: #555;
  font-weight: bold;
  background: white;
  animation: fadein-keyframes 2s ease 0.2s 1 forwards;
  float: left;
  z-index: 3;
  border-radius: 5px;
}

.font-small {
    font-size: small;
    color: gray;
    text-decoration: none;
}
</style>
