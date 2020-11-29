const currentYear = new Date().getFullYear()

const footerCopyright = document.getElementById('footer-copyright')
const copyrightElement = document.createTextNode('© ' + currentYear)
footerCopyright.appendChild(copyrightElement)