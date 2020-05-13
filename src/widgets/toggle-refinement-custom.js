export const renderToggleRefinementCustom = (renderOptions, isFirstRender) => {
  const { value, refine, widgetParams } = renderOptions

  // Find root wrapper in the DOM
  const containerEl = document.querySelector(widgetParams.container)

  // Add default class for toggleRefinementCustom root wrapper
  if (widgetParams && widgetParams.cssClasses && widgetParams.cssClasses.root) containerEl.classList.add(widgetParams.cssClasses.root)

  // Get text for label
  const labelText = (widgetParams.templates && widgetParams.templates.labelText) ? widgetParams.templates.labelText : widgetParams.attribute

  // On first render
  if (isFirstRender) {
    // Create label element for toggleRefinementCustom widget
    const label = document.createElement('label')

    // Add default class for toggleRefinementCustom label
    if (widgetParams && widgetParams.cssClasses && widgetParams.cssClasses.label) label.classList.add(widgetParams.cssClasses.label)

    // Create input element for toggleRefinementCustom widget
    const input = document.createElement('input')
    input.type = 'checkbox'

    // Add default class for toggleRefinementCustom checkbox
    if (widgetParams && widgetParams.cssClasses && widgetParams.cssClasses.checkbox) input.classList.add(widgetParams.cssClasses.checkbox)

    // Create span element with text for toggleRefinementCustom widget
    const labelElText = document.createElement('span')
    labelElText.innerHTML = labelText

    // Add default class for toggleRefinementCustom label text span wrapper
    if (widgetParams && widgetParams.cssClasses && widgetParams.cssClasses.labelText) labelElText.classList.add(widgetParams.cssClasses.labelText)

    // Add event listener for checkbox
    input.addEventListener('change', event => {
      refine({
        isRefined: !event.target.checked
      })
    })

    // Append input element to label element
    label.appendChild(input)

    // Append label text element to label element
    label.appendChild(labelElText)

    // Append label element to toggleRefinementCustom widget container
    containerEl.appendChild(label)
  }

  // Set correct state of toggleRefinementCustom widget
  containerEl.querySelector('input').checked = value.isRefined
}
