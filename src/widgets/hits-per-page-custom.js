// Create the render function
export const renderHitsPerPageCustom = (renderOptions, isFirstRender) => {
  const { items, hasNoResults, refine, widgetParams } = renderOptions

  if (isFirstRender) {
    const hitsPerPageCustomFirst = document.createElement('div')

    // select.addEventListener('change', event => {
    //   refine(event.target.value)
    // })

    // * NOTE: Use this when container attribute contains selector ('#foo')
    document.querySelector(widgetParams.container).appendChild(hitsPerPageCustomFirst) // container.appendChild(hitsPerPageCustomFirst)
  }

  let currentRefinementLabel = items.filter(item => item.isRefined)[0].label

  const hitsPerPageCustom = document.querySelector(widgetParams.container) // container.querySelector('div')

  if (hasNoResults) hitsPerPageCustom.classList.add('persoo-custom-select--disabled')

  hitsPerPageCustom.classList.add('persoo-custom-select')

  if (widgetParams.cssClasses && widgetParams.cssClasses.root) hitsPerPageCustom.classList.add(widgetParams.cssClasses.root)

  hitsPerPageCustom.innerHTML = `
    <button class="${widgetParams.cssClasses && widgetParams.cssClasses.toggler ? widgetParams.cssClasses.toggler + ' ' : ''}persoo-custom-select-toggler">${currentRefinementLabel}</button>
    <div class="${widgetParams.cssClasses && widgetParams.cssClasses.select ? widgetParams.cssClasses.select + ' ' : ''}persoo-custom-select-menu">
      ${items
      .map(
        item => `
          <a
            class="${widgetParams.cssClasses && widgetParams.cssClasses.item ? widgetParams.cssClasses.item + ' ' : ''}persoo-custom-select-option"
            data-persoo-option-value="${item.value}"
          >
            ${item.label}
          </a>
        `
      ).join('')}
    </div>
  `

  hitsPerPageCustom.querySelector('.persoo-custom-select-toggler').addEventListener('click', () => {
    hitsPerPageCustom.querySelector('.persoo-custom-select-menu').classList.toggle('persoo-custom-select-menu--visible')
  })

  hitsPerPageCustom.querySelectorAll('.persoo-custom-select-option').forEach(element => {
    element.addEventListener('click', event => {
      refine(event.target.dataset.persooOptionValue)

      currentRefinementLabel = items.filter(item => item.isRefined)[0].label
    })
  })
}
