<template>
  <b-container fluid>
    <b-row>
      <b-col cols="3">
        <b-button
          variant="outline-primary"
          @click="previousDate"
          title="<<"
          block
          style="height:100%"
          >&lt;&lt;</b-button
        >
      </b-col>
      <b-col cols="6" class="monthLabel">
        <h3>{{ this.getFormatedDateToTitle(current) }}</h3>
      </b-col>
      <b-col cols="3">
        <b-button
          variant="outline-primary"
          @click="nextDate"
          title=">>"
          block
          style="height:100%"
          >&gt;&gt;</b-button
        >
      </b-col>
    </b-row>
    <br>
    <b-row v-show="!items.length">
      <b-col>Não há registros para esse dia...</b-col>
    </b-row>
    <b-row v-for="item in items" :key="item.uuid">
      <b-col cols="1">
        <b-icon
          v-bind:icon="calculateEmoji(item.value)"
          aria-hidden="true"
        ></b-icon>
      </b-col>
      <b-col>
        {{
          item.situation.length > 20
            ? item.situation.substr(0, 20) + "..."
            : item.situation
        }}
      </b-col>
      <b-col>
        {{
          item.feelings.length > 20
            ? item.feelings.substr(0, 20) + "..."
            : item.feelings
        }}
      </b-col>
      <b-col cols="4">
        <b-button
          variant="outline-primary"
          @click="$router.push('/log/' + item.uuid)"
          title="Ver"
        >
          <b-icon icon="eye" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          variant="outline-danger"
          @click="deleteItem(item.uuid)"
          title="Excluir"
        >
          <b-icon icon="x-circle" aria-hidden="true"></b-icon>
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
const base = [];
export default {
  name: "LogDay",
  data() {
    let items = this.clone(base);

    this.fetchData();

    return {
      loading: false,
      isEdit: false,
      items: items,
    };
  },
  watch: {
    items: (_) => _,
    $route: "fetchData",
  },
  methods: {
    fetchData() {
      this.loading = true;
      //console.log("fetch invoked");
      //console.log(this.$route.params.day);
      if (!this.$route.params.day) {
        this.loading = false;
        this.current = new Date();
        this.setItem(this.clone(base));
        return;
      }
      const day = this.$route.params.day;
      this.current = new Date(day + 'T00:00');
      this.getLogsByDate(
        day,
        (items) => {
          this.loading = false;
          this.isEdit = true;
          this.setItem(items);
          //console.log("Resultado busca:", items);
        },
        (err) => {
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
    setItem(items) {
      //console.log(items);
      this.items = items;
    },
    deleteItem(id) {
      if (!confirm("Confirma a exclusão?")) return;
      this.deleteLog(
        id,
        () => {
          console.log("item excluído!");
          this.fetchData();
        },
        (err) => console.log("Erro:", err)
      );
    },
    previousDate() {
      const previous = new Date(this.current.toDateString());
      //console.log(previous);
      previous.setDate(previous.getDate() - 1);
      const formatedDate = this.formatDate(previous);
      this.$router.push(`/log-day/${formatedDate}`);
    },
    nextDate() {
      const next = new Date(this.current.toDateString());
      //console.log(next);
      next.setDate(next.getDate() + 1);
      const formatedDate = this.formatDate(next);
      this.$router.push(`/log-day/${formatedDate}`);
    },
  },
};
</script>
