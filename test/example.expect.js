/* eslint-env browser */
import './example.css';
const title = document.createElement('h1');
title.textContent = 'doctor-jones 是一个「治疗」中英文混排格式的工具';
title.className = 'title';
const b = React.createElement("div", null, "alkdfkj");
const c = `
  abc${1}def${2}ghi
`; // doctor-jones-disabled-line

const d = 'doctor-jones 是一个「治疗」中英文混排格式的工具';
const app = document.getElementById('app');

if (app) {
  app.appendChild(title);
}
