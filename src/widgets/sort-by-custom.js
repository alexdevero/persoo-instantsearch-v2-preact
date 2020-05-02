// Create the render function
export const renderSortByCustom = (renderOptions, isFirstRender) => {
  const { options, currentRefinement, hasNoResults, refine, widgetParams } = renderOptions

  if (isFirstRender) {
    const sortByCustom = document.createElement('div')

    // sortByCustom.addEventListener('click', event => {
    //   refine(event.target.value)
    // })

    // * NOTE: Use this when container attribute contains selector ('#foo')
    document.querySelector(widgetParams.container).appendChild(sortByCustom)
  }

  let currentSelectedOption = options.filter(option => option.value === currentRefinement)[0].label

  const sortByCustom = document.querySelector(widgetParams.container)

  // if (hasNoResults) sortByCustom.classList.add('persoo-custom-select--disabled')

  sortByCustom.classList.add('persoo-custom-select')

  if (widgetParams.cssClasses && widgetParams.cssClasses.root) sortByCustom.classList.add(widgetParams.cssClasses.root)

  sortByCustom.innerHTML = `
    <button class="${widgetParams.cssClasses && widgetParams.cssClasses.toggler ? widgetParams.cssClasses.toggler + ' ' : ''}persoo-custom-select-toggler">${currentSelectedOption}</button>
    <div class="${widgetParams.cssClasses && widgetParams.cssClasses.select ? widgetParams.cssClasses.select + ' ' : ''}persoo-custom-select-menu">
      ${options
        .map(
          option => `
            <a
              class="${widgetParams.cssClasses && widgetParams.cssClasses.item ? widgetParams.cssClasses.item + ' ' : ''}persoo-custom-select-option"
              data-persoo-item-value="${option.value}"
              ${option.value === currentRefinement ? 'selected' : ''}
            >
              ${option.label}
            </a>
          `
        )
        .join('')}
    </div>
  `

  sortByCustom.querySelector('.persoo-custom-select-toggler').addEventListener('click', () => {
    sortByCustom.querySelector('.persoo-custom-select-menu').classList.toggle('persoo-custom-select-menu--visible')
  })

  sortByCustom.querySelectorAll('.persoo-custom-select-option').forEach(element => {
    element.addEventListener('click', event => {
      refine(event.target.dataset.persooItemValue)

      currentSelectedOption = options.filter(option => option.value === currentRefinement)[0].label
    })
  })
}
