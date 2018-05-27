document.addEventListener('DOMContentLoaded', () => {
  const SYNTAXES = ['reason', 'ocaml']
  const CLASS_PREFIX = 'syntax__'
  const $toggleSyntaxButton = document.createElement('div')

  $toggleSyntaxButton.classList.add('button', 'toggleSyntaxButton')
  $toggleSyntaxButton.innerHTML = `
    <span class="toggleSyntaxButton-reason">Reason</span>
    <span class="toggleSyntaxButton-ocaml">OCaml</span>
  `
  document.querySelector('.headerWrapper.wrapper > header > a').insertAdjacentElement('afterend', $toggleSyntaxButton);

  let currentSyntax
  let setCurrentSyntax = (syntax = SYNTAXES[0]) => {
    document.body.classList.remove(`${CLASS_PREFIX}${currentSyntax}`)
    document.body.classList.add(`${CLASS_PREFIX}${syntax}`)

    currentSyntax = syntax
    localStorage.setItem('syntax', currentSyntax)
  }

  setCurrentSyntax(localStorage.getItem('syntax', currentSyntax) || SYNTAXES[0])

  $toggleSyntaxButton.addEventListener('click', () => {
    setCurrentSyntax(currentSyntax == SYNTAXES[0] ? SYNTAXES[1] : SYNTAXES[0])
  })
})
