<template>
  <b-container fluid class="table-responsive">
    <b-alert :show="updateExists">
      Atualização disponível!
      <b-button variant="outline-primary" @click="refreshApp">
        Atualizar
      </b-button>
    </b-alert>
    <b-row>
      <b-col>
        <b-button variant="outline-primary" @click="previousMonth" title="<<"
          >&lt;&lt;</b-button
        >
      </b-col>
      <b-col>
        {{ monthLabel }}
      </b-col>
      <b-col>
        <b-button variant="outline-primary" @click="nextMonth" title=">>"
          >&gt;&gt;</b-button
        >
      </b-col>
    </b-row>
    <table ref="table" class="table table-bordered calendar">
      <thead>
        <tr>
          <th scope="col">Dom</th>
          <th scope="col">Seg</th>
          <th scope="col">Ter</th>
          <th scope="col">Qua</th>
          <th scope="col">Qui</th>
          <th scope="col">Sex</th>
          <th scope="col">Sáb</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </b-container>
</template>
<style>
.table.table-bordered.calendar {
  font-size: 2vw;
}
.container-flex {
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  height: 6vw;
}
.container-item {
  list-style-type: none;
}
.container-item:first-child {
  font-size: 4vw;
}
</style>
<script>
import update from '../mixins/update'

export default {
  name: "NewLog",
  data() {
    /*Promise.all([fetch("/service-worker.js"),fetch("https://diario-emocoes.bj-consulting.net/service-worker.js")]).then(values => {
      console.log(values);
    });*/

    window["r"] = this.$router;
    this.fetchData();

    return {
      loading: false,
      base: new Date(),
      monthLabel: "",
      items: [],
    };
  },
  mixins: [update],
  watch: {
    items: (_) => _,
    base: "fetchData",
    $route: "fetchData",
  },
  methods: {
    fetchData() {
      //console.log("fetch invoked");

      if (!this.base) {
        this.$nextTick(() => this.fetchData());
        return;
      }

      this.monthLabel = this.getMonthAndYearFull(this.base);

      this.onDbReady(() => {
        const begin = new Date(
          this.base.getFullYear(),
          this.base.getMonth(),
          1
        );

        const tbody = this.$refs.table.tBodies[0];

        for (let i = 0; i < tbody.rows.length; ) tbody.deleteRow(i);

        let index = new Date(this.clone(begin));
        let counter = 0;
        let curRow = null;
        let days = [];
        while (index.getMonth() === this.base.getMonth()) {
          if (counter % 7 === 0) {
            curRow = tbody.insertRow();
          }
          const curCell = curRow.insertCell();

          curCell.classList.add("cell");

          if (index.getDay() !== counter++ % 7) {
            curCell.appendChild(document.createTextNode(""));
            continue;
          }

          const formatedDate = this.formatDate(index);
          const dayOfMonth = index.getDate();
          //console.log(formatedDate);
          this.getLogsByDate(
            formatedDate,
            (arr) => {
              //console.log(arr);
              const medium = arr.length
                ? arr.reduce((acc, item) => acc + item.value, 0) / arr.length
                : -1;
              //console.log(medium);
              this.$createElement();
              curCell.innerHTML = `<a href="/log-day/${formatedDate}" onclick="event.preventDefault();window.r.push('/log-day/${formatedDate}');">
                <ul class="container-flex">
                  <li class="container-item">${dayOfMonth}</li>
                  <li class="container-item">${
                    arr.length ? arr.length : ""
                  }</li>
                  <li class="container-item">${this.calculateEmoji(medium)}</li>
                </ul>
              </a>`;
            },
            (err) => console.log(err)
          );

          curCell.innerHTML = `<a href="/log-day/${formatedDate}>${dayOfMonth}</a>`;
          days.push(new Date(this.clone(index)));
          index.setDate(index.getDate() + 1);
        }

        for (let i = 0; (index.getDay() > 0) & (i <= 6 - index.getDay()); i++) {
          const curCell = curRow.insertCell();
          curCell.classList.add("cell");
          curCell.appendChild(document.createTextNode(""));
        }

        this.setItems(days);
      });
    },
    calculateEmoji(val) {
      if (val === -1) return "";
      if (this.between(val, 0, 1))
        return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-emoji-angry" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683z"/>
  <path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
  <path fill-rule="evenodd" d="M4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 1 1-.447.894l-2-1a.5.5 0 0 1-.223-.67zm7.894 0a.5.5 0 0 0-.67-.223l-2 1a.5.5 0 1 0 .447.894l2-1a.5.5 0 0 0 .223-.67z"/>
</svg>`;
      if (this.between(val, 1, 2))
        return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-emoji-frown" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683z"/>
  <path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
</svg>`;
      if (this.between(val, 2, 3))
        return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-emoji-neutral" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"/>
  <path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
</svg>`;
      if (this.between(val, 3, 4))
        return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-emoji-smile" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683z"/>
  <path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
</svg>`;
      if (this.between(val, 4, 5))
        return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-emoji-laughing" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M12.331 9.5a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5z"/>
  <path d="M7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5z"/>
</svg>`;
    },
    setItems(items) {
      this.items = items;
    },
    previousMonth() {
      this.base.setMonth(this.base.getMonth() - 1);
      this.fetchData();
    },
    nextMonth() {
      this.base.setMonth(this.base.getMonth() + 1);
      this.fetchData();
    },
  },
};
</script>
