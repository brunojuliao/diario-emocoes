<template>
  <b-container fluid>
    <h1>{{ isEdit ? "Editar" : "Nova" }} Entrada</h1>

    <b-row>
      <b-col>
        <b-form-datepicker
          v-model="item.date"
          locale="pt-BR"
        ></b-form-datepicker>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="4">
        <b-icon
          class="icon"
          v-bind:icon="calculateEmoji(item.value)"
          aria-hidden="true"
        ></b-icon>
      </b-col>
      <b-col sm="8">
        <!--<b-input-group>
          <b-input-group-prepend>
            <b-button @click="item.value -= item.value > 1 ? 1 : 0"
              >Negativo</b-button
            >
          </b-input-group-prepend>-->
          <input type="range" min="1" max="5" step="1" v-model="item.value" style="width:100%;"/>
          <!--<b-form-rating
            icon-empty="circle"
            icon-half="circle-half"
            icon-full="circle-fill"
            v-model="item.value"
          ></b-form-rating>-->
          <!--<b-input-group-append>
            <b-button @click="item.value += item.value < 5 ? 1 : 0"
              >Positivo</b-button
            >
          </b-input-group-append>
        </b-input-group>-->
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="4">
        <label for="situation">Descreva o que ocorreu</label>
      </b-col>
      <b-col sm="8">
        <b-form-textarea
          id="situation"
          v-model="item.situation"
          placeholder="Descreva o que ocorreu"
          rows="3"
        >
        </b-form-textarea>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="4">
        <label for="feelings">Descreva o como se sentiu</label>
      </b-col>
      <b-col sm="8">
        <b-form-textarea
          v-model="item.feelings"
          placeholder="Descreva o como se sentiu"
          rows="3"
        >
        </b-form-textarea>
      </b-col>
    </b-row>

    <b-row>
      <b-col style="text-align:right;">
        <b-button @click="save(item)">Salvar</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<style scoped>
textarea {
  resize: none;
}
.icon {
  font-size: 2.4rem;
}
</style>
<script>
const current_date = new Date();
const addLeadZero = (n) => ("00" + n).substr(-2);
const formatDate = (date) =>
  `${date.getFullYear()}-${addLeadZero(date.getMonth() + 1)}-${addLeadZero(
    date.getDate()
  )}`;
const base = {
  value: 3,
  situation: null,
  feelings: null,
  date: formatDate(current_date),
};
export default {
  name: "Log",
  data() {
    if (this.$route.query.day)
      base.date = this.$route.query.day;

    let item = this.clone(base);

    this.fetchData();

    return {
      loading: false,
      isEdit: false,
      showCalendar: false,
      item: item,
    };
  },
  watch: {
    item: (_) => _,
    $route: "fetchData",
  },
  methods: {
    fetchData() {
      this.loading = true;
      //console.log("fetch invoked");
      if (!this.$route.params.id) {
        this.loading = false;
        this.setItem(this.clone(base));
        return;
      }
      const id = this.$route.params.id;
      this.getLogById(
        id,
        (item) => {
          if (this.$route.params.id !== id) return;
          this.loading = false;
          this.isEdit = true;
          this.setItem(item);
          //console.log("Resultado busca:", item);
        },
        (err) => {
          if (this.$route.params.id !== id) return;
          this.loading = false;
          this.isEdit = false;
          console.log("Erro:", err);
        }
      );
    },
    calculateEmoji(val) {
      if (this.between(val, 0, 1)) return "emoji-angry";
      if (this.between(val, 1, 2)) return "emoji-frown";
      if (this.between(val, 2, 3)) return "emoji-neutral";
      if (this.between(val, 3, 4)) return "emoji-smile";
      if (this.between(val, 4, 5)) return "emoji-laughing";
    },
    save(item) {
      this.saveLog(
        item,
        () => {
          console.log("item salvo!");
          this.fetchData();
        },
        (err) => console.log("Erro:", err)
      );
    },
    setItem(item) {
      //console.log(item);
      this.item = item;
    },
  },
};
</script>
