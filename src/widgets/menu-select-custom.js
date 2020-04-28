export const renderMenuSelectCustom = (renderOptions, isFirstRender) => {
  const { items, canRefine, refine, widgetParams } = renderOptions

  let currentSelectedOption

  if (isFirstRender) {
    const menuSelectCustomEl = document.createElement('div')

    // menuSelectCustomEl.addEventListener('click', event => {
    //   refine(event.target.value)
    // })

    console.log(renderOptions)

    currentSelectedOption = items && items.filter(item => item.isRefined)

    console.log(items)

    widgetParams.container.appendChild(menuSelectCustomEl)
  }

  const selectMenuCustom = widgetParams.container.querySelector('div')

  selectMenuCustom.classList.add('persoo-custom-select')

  if (widgetParams.cssClasses && widgetParams.cssClasses.root) selectMenuCustom.classList.add(widgetParams.cssClasses.root)

  selectMenuCustom.innerHTML = `
    <button class="${widgetParams.cssClasses && widgetParams.cssClasses.toggler ? widgetParams.cssClasses.toggler + ' ' : ''}persoo-custom-select-toggler ${!canRefine ? 'persoo-custom-select-toggler-disabled' : ''}">${currentSelectedOption}</button>
    <div class="${widgetParams.cssClasses && widgetParams.cssClasses.select ? widgetParams.cssClasses.select + ' ' : ''}persoo-custom-select-menu">
      <a
        class="${widgetParams.cssClasses && widgetParams.cssClasses.item ? widgetParams.cssClasses.item + ' ' : ''}persoo-custom-select-option"
        data-persoo-item-value="See all"
      >
        See all
      </a>
      ${items
        .map(
          item => `
            <a
              class="${widgetParams.cssClasses && widgetParams.cssClasses.item ? widgetParams.cssClasses.item + ' ' : ''}persoo-custom-select-option"
              data-persoo-item-value="${item.value}"
              ${item.isRefined ? 'selected' : ''}
            >
              ${item.label}
            </a>
          `
        )
        .join('')}
    </div>
  `

  selectMenuCustom.querySelector('.persoo-custom-select-toggler').addEventListener('click', () => {
    selectMenuCustom.querySelector('.persoo-custom-select-menu').classList.toggle('persoo-custom-select-menu--visible')
  })

  // selectMenuCustom.querySelectorAll('.persoo-custom-select-option').forEach(element => {
  //   element.addEventListener('click', event => {
  //     refine(event.target.dataset.persooOptionValue)

  //     // currentSelectedOption = options.filter(option => option.value === currentRefinement)[0].label
  //   })
  // })
}
