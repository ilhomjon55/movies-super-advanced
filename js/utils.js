let $_ = (selector, parent = document) => {
   return parent.querySelector(selector)
}

let $$_ = (selector, parent = document) => {
   return parent.querySelectorAll(selector)
}