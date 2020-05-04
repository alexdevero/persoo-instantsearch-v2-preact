// Create the render function
export const renderMenuSelectCustom = (renderOptions, isFirstRender) => {
  const { items, canRefine, refine, widgetParams } = renderOptions

  let currentSelectedOption
  let currentSelectedOptionCount
  let selectMenuCustom

  let defaultOption = widgetParams.templates.defaultOption ? widgetParams.templates.defaultOption : 'Zobrazit vše'

  // On first render
  if (isFirstRender) {
    // Create element wrapper for selectMenuCustom widget
    selectMenuCustom = document.createElement('div')

    // menuSelectCustomEl.addEventListener('click', event => {
    //   refine(event.target.value)
    // })

    // * NOTE: Use this when container attribute contains selector ('#foo')
    document.querySelector(widgetParams.container).appendChild(selectMenuCustom)
  }

  // Find currently selected option
  currentSelectedOption = items.filter(item => item.isRefined)[0] === undefined ? widgetParams.templates.defaultOption : items.filter(item => item.isRefined)[0].label

  // Update count for selected option
  // or reset it for unselected state
  currentSelectedOptionCount = items.filter(item => item.isRefined)[0] !== undefined ? items.filter(item => item.isRefined)[0].count : null

  // Cache the selectMenuCustom container
  selectMenuCustom = document.querySelector(widgetParams.container)

  // Add default class for selectMenuCustom
  selectMenuCustom.classList.add('persoo-custom-select')

  // Apply root class if user provided it
  if (widgetParams.cssClasses && widgetParams.cssClasses.root) selectMenuCustom.classList.add(widgetParams.cssClasses.root)

  // Construct DOM of selectMenuCustom dropdown
  selectMenuCustom.innerHTML = `
    <button
      class="${widgetParams.cssClasses && widgetParams.cssClasses.toggler ? widgetParams.cssClasses.toggler + ' ' : ''}persoo-custom-select-toggler ${!canRefine ? 'persoo-custom-select-toggler-disabled' : ''}"
    >
      ${currentSelectedOption} ${currentSelectedOptionCount !== null ? `(${currentSelectedOptionCount})` : ''}
    </button>
    <div class="${widgetParams.cssClasses && widgetParams.cssClasses.select ? widgetParams.cssClasses.select + ' ' : ''}persoo-custom-select-menu">
      ${items
        .map(
          item => `
            <a
              class="${widgetParams.cssClasses && widgetParams.cssClasses.item ? widgetParams.cssClasses.item + ' ' : ''}persoo-custom-select-option"
              data-persoo-item-value="${item.value}"
              ${item.isRefined ? 'selected' : ''}
            >
              ${item.isRefined ? defaultOption : item.label} ${!item.isRefined ? `(${item.count})` : ''}
            </a>
          `
        )
        .join('')}
    </div>
  `

  // Add event listener to open dropdown
  // when user clicks on dropdown button
  selectMenuCustom.querySelector('.persoo-custom-select-toggler').addEventListener('click', () => {
    selectMenuCustom.querySelector('.persoo-custom-select-menu').classList.toggle('persoo-custom-select-menu--visible')
  })

  // Add event listener to close dropdown
  // when user clicks outside it
  document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('persoo-custom-select-option') &&
    !event.target.classList.contains('persoo-custom-select-menu') &&
    !event.target.classList.contains('persoo-custom-select-toggler') &&
    !event.target.classList.contains('persoo-custom-select')) {
      if (selectMenuCustom.querySelector('.persoo-custom-select-menu').classList.contains('persoo-custom-select-menu--visible')) {
        selectMenuCustom.querySelector('.persoo-custom-select-menu').classList.remove('persoo-custom-select-menu--visible')
      }
    }
  })

  // Add event listener to options
  // to trigger refinement of values
  selectMenuCustom.querySelectorAll('.persoo-custom-select-option').forEach(element => {
    element.addEventListener('click', event => {
      refine(event.target.dataset.persooItemValue)

      // currentSelectedOption = items.filter(item => item.isRefined)[0].label
      // currentSelectedOptionCount = items.filter(item => item.isRefined)[0].count
    })
  })
}
