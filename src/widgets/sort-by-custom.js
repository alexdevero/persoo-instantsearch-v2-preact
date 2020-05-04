// Create the render function
export const renderSortByCustom = (renderOptions, isFirstRender) => {
  const { options, currentRefinement, hasNoResults, refine, widgetParams } = renderOptions

  let sortByCustom

  // On first render
  if (isFirstRender) {
    // Create element wrapper for sortByCustom widget
    sortByCustom = document.createElement('div')

    // sortByCustom.addEventListener('click', event => {
    //   refine(event.target.value)
    // })

    // * NOTE: Use this when container attribute contains selector ('#foo')
    document.querySelector(widgetParams.container).appendChild(sortByCustom)
  }

  // Find currently selected option
  let currentSelectedOption = options.filter(option => option.value === currentRefinement)[0].label

  // Cache the sortByCustom container
  sortByCustom = document.querySelector(widgetParams.container)

  // if (hasNoResults) sortByCustom.classList.add('persoo-custom-select--disabled')

  // Add default class for sortByCustom
  sortByCustom.classList.add('persoo-custom-select')

  // Apply root class if user provided it
  if (widgetParams.cssClasses && widgetParams.cssClasses.root) sortByCustom.classList.add(widgetParams.cssClasses.root)

  // Construct DOM of sortByCustom dropdown
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

  // Add event listener to open dropdown
  // when user clicks on dropdown button
  sortByCustom.querySelector('.persoo-custom-select-toggler').addEventListener('click', () => {
    sortByCustom.querySelector('.persoo-custom-select-menu').classList.toggle('persoo-custom-select-menu--visible')
  })

  // Add event listener to close dropdown
  // when user clicks outside it
  document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('persoo-custom-select-option') &&
    !event.target.classList.contains('persoo-custom-select-menu') &&
    !event.target.classList.contains('persoo-custom-select-toggler') &&
    !event.target.classList.contains('persoo-custom-select')) {
      if (sortByCustom.querySelector('.persoo-custom-select-menu').classList.contains('persoo-custom-select-menu--visible')) {
        sortByCustom.querySelector('.persoo-custom-select-menu').classList.remove('persoo-custom-select-menu--visible')
      }
    }
  })

  // Add event listener to options
  // to trigger refinement of values
  sortByCustom.querySelectorAll('.persoo-custom-select-option').forEach(element => {
    element.addEventListener('click', event => {
      refine(event.target.dataset.persooItemValue)

      // currentSelectedOption = options.filter(option => option.value === currentRefinement)[0].label
    })
  })
}
