// Create the render function
export const renderHitsPerPageCustom = (renderOptions, isFirstRender) => {
  const { items, hasNoResults, refine, widgetParams } = renderOptions

  let hitsPerPageCustom

  // On first render
  if (isFirstRender) {
    // Create element wrapper for sortByCustom widget
    hitsPerPageCustom = document.createElement('div')

    // select.addEventListener('change', event => {
    //   refine(event.target.value)
    // })

    // * NOTE: Use this when container attribute contains selector ('#foo')
    document.querySelector(widgetParams.container).appendChild(hitsPerPageCustom) // container.appendChild(hitsPerPageCustomFirst)
  }

  // Find currently selected option
  let currentRefinementLabel = items.filter(item => item.isRefined)[0].label

  // Cache the sortByCustom container
  hitsPerPageCustom = document.querySelector(widgetParams.container) // container.querySelector('div')

  // Disable dropdown if there are no results (hits)
  if (hasNoResults) hitsPerPageCustom.classList.add('persoo-custom-select--disabled')

  // Add default class for hitsPerPageCustom
  hitsPerPageCustom.classList.add('persoo-custom-select')

  // Apply root class if user provided it
  if (widgetParams.cssClasses && widgetParams.cssClasses.root) hitsPerPageCustom.classList.add(widgetParams.cssClasses.root)

  // Construct DOM of sortByCustom dropdown
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

  // Add event listener to open dropdown
  // when user clicks on dropdown button
  hitsPerPageCustom.querySelector('.persoo-custom-select-toggler').addEventListener('click', () => {
    hitsPerPageCustom.querySelector('.persoo-custom-select-menu').classList.toggle('persoo-custom-select-menu--visible')
  })

  // Add event listener to close dropdown
  // when user clicks outside it
  document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('persoo-custom-select-option') &&
    !event.target.classList.contains('persoo-custom-select-menu') &&
    !event.target.classList.contains('persoo-custom-select-toggler') &&
    !event.target.classList.contains('persoo-custom-select')) {
      if (hitsPerPageCustom.querySelector('.persoo-custom-select-menu').classList.contains('persoo-custom-select-menu--visible')) {
        hitsPerPageCustom.querySelector('.persoo-custom-select-menu').classList.remove('persoo-custom-select-menu--visible')
      }
    }
  })

  // Add event listener to options
  // to trigger refinement of values
  hitsPerPageCustom.querySelectorAll('.persoo-custom-select-option').forEach(element => {
    element.addEventListener('click', event => {
      refine(event.target.dataset.persooOptionValue)

      // currentRefinementLabel = items.filter(item => item.isRefined)[0].label
    })
  })
}
