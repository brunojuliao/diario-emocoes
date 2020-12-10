import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { v1 as uuid } from 'uuid'

Vue.config.productionTip = false

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

const openRequest = indexedDB.open('diario-emocoes');
var dbs = null;

openRequest.onupgradeneeded = function (event) {

  const db = event.target.result;

  if (!db.objectStoreNames.contains('registros')) {
    const registros = db.createObjectStore('registros', { keyPath: 'uuid' });
    registros.createIndex('date_idx', 'date');
  }
  console.log('Banco inicializado!');
};

openRequest.onerror = function () {
  console.error('Error', openRequest.error);
};

openRequest.onsuccess = function () {
  dbs = openRequest.result;

  console.log('Banco aberto!');
  if (onDbReady) {
    onDbReady();
    onDbReady = null;
  }
};

let onDbReady = null;

const addLeadZero = (n) => ('00' + n).substr(-2);
const getUuid = d => uuid({msecs: (d ?? new Date()).getTime()});

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

Vue.mixin({
  methods: {
    clone: obj => JSON.parse(JSON.stringify(obj)),
    addLeadZero: addLeadZero,
    getUuid: getUuid,
    between: (val, min, max) => min <= val && val <= max,
    saveLog: (log, success, error) => {
      const transaction = dbs.transaction('registros', 'readwrite');
      const registros = transaction.objectStore('registros');

      if (!log.uuid) log.uuid = getUuid();

      const addRequest = registros.put(log);

      addRequest.onsuccess = function () {
        success();
      };

      addRequest.onerror = function () {
        error(addRequest.error);
      };
    },
    getLogById: (id, success, error) => {
      const transaction = dbs.transaction('registros', 'readonly');
      const registros = transaction.objectStore('registros');
      const getRequest = registros.get(id);

      getRequest.onsuccess = function () {
        success(getRequest.result);
      }

      getRequest.onerror = function () {
        error(getRequest.error);
      }
    },
    getLogsByDate: (date, success, error) => {
      //console.log(date);
      const transaction = dbs.transaction('registros', 'readonly');
      const registros = transaction.objectStore('registros');
      const dateIdx = registros.index('date_idx');
      const getRequest = dateIdx.getAll(date);

      getRequest.onsuccess = function () {
        success(getRequest.result);
      }

      getRequest.onerror = function () {
        error(getRequest.error);
      }
    },
    deleteLog: (id, success, error) => {
      const transaction = dbs.transaction('registros', 'readwrite');
      const registros = transaction.objectStore('registros');
      const deleteRequest = registros.delete(id);

      deleteRequest.onsuccess = function () {
        success(deleteRequest.result);
      }

      deleteRequest.onerror = function () {
        error(deleteRequest.error);
      }
    },
    formatDate: date => `${date.getFullYear()}-${addLeadZero(date.getMonth() + 1)}-${addLeadZero(date.getDate())}`,
    onDbReady: action => {
      if (dbs)
        action()
      else
        onDbReady = action
    },
    getFormatedDateToTitle: d => `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`,
    getMonthAndYearFull: d => `${months[d.getMonth()]} de ${d.getFullYear()}`,
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
