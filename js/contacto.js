const $form= document.querySelector('#form')
const $buttonMailto= document.querySelector('#recetas')
$form.addEventListener('submit', handleSubmit)
function handleSubmit(event){
    event.preventDefault()

  //para extraer informacion//
  const form = new FormData(this)
  recetas.setAttribute('href', `mailto:braguilar.brdiaz@gmail.com?subject=${form.get('name')}${form.get('email')}&body=${form.get('message')}`)
  recetas.click()
  $buttonMailto.setAttribute('href', `mailto:braguilar.brdiaz@gmail.com?subject=nombre ${form.get('name')}  correo ${form.get('email')}&body=${form.get('message')}`)
  $buttonMailto.click()
  //contra tiene que darle enviar desde su correo// ventaja puede contactarselas veces que quiere//
}