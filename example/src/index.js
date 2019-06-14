import './assets/css/style.css'

const title = document.createElement('h1')
title.textContent = 'doctor-jones是一个“治疗”中英文混排格式的工具'
title.className = 'title'

const content = document.createElement('p')
// doctor-jones-disabled-line
content.textContent = 'doctor-jones是一个“治疗”中英文混排格式的工具'
content.className = 'content'

const app = document.getElementById('app')

if (app) {
  app.appendChild(title)
  app.appendChild(content)
}
