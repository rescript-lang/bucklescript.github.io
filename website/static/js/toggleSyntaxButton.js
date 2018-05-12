document.addEventListener('DOMContentLoaded', () => {
  const CLASS_REASON = 'syntax__reason'
  const $toggleSyntaxButton = document.createElement('button')

  $toggleSyntaxButton.classList.add('button', 'toggleSyntaxButton')
  $toggleSyntaxButton.innerHTML = `
    <span class="toggleSyntaxButton-reason">Reason</span>
    <span class="toggleSyntaxButton-ocaml">OCaml</span>
  `

  document.body.appendChild($toggleSyntaxButton)

  $toggleSyntaxButton.addEventListener('click', () => {
    document.body.classList.toggle(CLASS_REASON)
  })
})
