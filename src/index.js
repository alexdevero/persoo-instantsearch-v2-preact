// https://www.algolia.com/doc/api-reference/widgets/js/

// import { Component } from 'preact'
import algoliasearch from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'

// Import String.normalize polyfill
import 'unorm'

// Import Array.includes polyfill
import 'mdn-polyfills/Array.prototype.includes'

// Import Array.forEach polyfill
import 'mdn-polyfills/Array.prototype.forEach'

// Import Promise polyfill
import 'promise-polyfill/src/polyfill'

// Import default widgets
// import {
//   clearRefinements,
//   currentRefinements,
//   hierarchicalMenu,
//   hits,
//   hitsPerPage,
//   menu,
//   menuSelect,
//   numericMenu,
//   pagination,
//   panel,
//   rangeInput,
//   rangeSlider,
//   ratingMenu,
//   refinementList,
//   searchBox,
//   sortBy,
//   stats,
//   toggleRefinement
// } from 'instantsearch.js/es/widgets'

// Import Algolia connectors
import { connectHitsPerPage, connectSortBy, connectMenu, connectPoweredBy } from 'instantsearch.js/es/connectors'

// Import custom widgets
import { renderHitsPerPageCustom } from './widgets/hits-per-page-custom'
import { renderSortByCustom } from './widgets/sort-by-custom'
import { renderMenuSelectCustom } from './widgets/menu-select-custom'
import { renderPoweredByCustom } from './widgets/powered-by-custom'

// Import Algolia styles
import './styles/algolia-reset.css'
// import './styles/algolia-satelite.css'

// Import components' styles
import './styles/components/base-general-styles.css'
import './styles/components/breadcrumbs.css'
import './styles/components/clear-refinements.css'
import './styles/components/current-refinements.css'
import './styles/components/geo-search.css'
import './styles/components/hierarchical-menu.css'
import './styles/components/hits-per-page.css'
import './styles/components/hits.css'
import './styles/components/infinite-hits.css'
import './styles/components/menu.css'
import './styles/components/numeric-menu.css'
import './styles/components/pagination.css'
import './styles/components/panel.css'
import './styles/components/powered-by.css'
import './styles/components/range-slider.css'
import './styles/components/rating-menu.css'
import './styles/components/refinement-list.css'
import './styles/components/results-per-page.css'
import './styles/components/results.css'
import './styles/components/rheostat.css'
import './styles/components/search-box.css'
import './styles/components/snippet.css'
import './styles/components/sort-by.css'
import './styles/components/stats.css'
import './styles/components/toggle-refinement.css'
import './styles/components/voice-search.css'

// Import custom components' styles
import './styles/custom-components/persoo-custom-select.css'
import './styles/custom-components/persoo-custom-powered-by.css'

// Import temporary styles for cards
import './styles/temporary-card-styles.css'

// Import main stylesheet
import './styles/style.css'

// Import Persoo
import PersooInstantSearchClient from './lib/persooInstant-search-client'
import { getRenderFunction, throttle } from './lib/utils'

// Imports for Persoo
import * as instantSearchWidgets from 'instantsearch.js/es/widgets'

// Function to make IE9+ support forEach also for NodeList (use with polyfill):
if (typeof window !== 'undefined') {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach
  }
}

function createInstantSearchConnector(options) {
  const searchClient = new PersooInstantSearchClient(options)
  let callbacks = {}

  const instantSearchOptions = {
    appId: 'noAppID',
    apiKey: 'noAPIKey',
    searchClient: searchClient,
    indexName: options.indexName || 'products',
    createAlgoliaClient: function(algoliasearch, appId, apiKey) {
      return searchClient
    },
    routing: options.routing || false
  }

  if (options.hideOnEmptyQuery) {
    instantSearchOptions.searchFunction = function(helper) {
      const isEmptyQuery = (helper.getStateAsQueryString() == 'q=')

      if (isEmptyQuery) {
        callbacks.hide && callbacks.hide()
        /* Note: call search() even if hidden to update url params a input box query */
      }

      helper.search()
      callbacks.show && callbacks.show()
    }
  }

  const instantSearchInstance = instantsearch(instantSearchOptions)

  instantSearchInstance.addListener('error', function(data) {
    console.log('Persoo error handler', JSON.stringify(arguments))
  })

  instantSearchInstance.setPersooCallback = function(name, func) {
    callbacks[name] = func
  }

  return instantSearchInstance
}

// Wire custom widgets
const hitsPerPageCustom = connectHitsPerPage(renderHitsPerPageCustom)
const sortByCustom = connectSortBy(renderSortByCustom)
const menuSelectCustom = connectMenu(renderMenuSelectCustom)
const poweredByCustom = connectPoweredBy(renderPoweredByCustom)

// Export everything
if (typeof window !== 'undefined') {
  window.persooInstantSearch = createInstantSearchConnector
  window.persooInstantSearch.EJS = getRenderFunction
  window.persooInstantSearch.throttle = throttle
  window.persooInstantSearch.widgets = instantSearchWidgets
  window.persooInstantSearch.widgets.hitsPerPageCustom = hitsPerPageCustom
  window.persooInstantSearch.widgets.sortByCustom = sortByCustom
  window.persooInstantSearch.widgets.menuSelectCustom = menuSelectCustom
  window.persooInstantSearch.widgets.poweredByCustom = poweredByCustom


  window.algoliasearch = algoliasearch
  window.instantsearch = instantsearch
  window.algoliaWidgets = instantSearchWidgets
}
// window.hitsPerPage = hitsPerPage
// window.pagination = pagination

// const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')

// setTimeout(function() {
//   const search = instantsearch({
//     indexName: 'instant_search',
//     searchClient
//   })

//   const hitsPerPageCustom = connectHitsPerPage(renderHitsPerPageCustom)
//   const sortByCustom = connectSortBy(renderSortByCustom)
//   const menuSelectCustom = connectMenu(renderMenuSelectCustom)

//   const refinementListWithPanel = panel({
//     templates: {
//       header: 'Brand'
//     }
//   })(refinementList)

//   search.addWidgets([
//     hitsPerPageCustom({
//       container: document.querySelector('#persoo-hits-per-page-custom'),
//       items: [
//         { label: '8 per page', value: 8, default: true },
//         { label: '16 per page', value: 16 },
//         { label: '32 per page', value: 32 }
//       ],
//       cssClasses: {
//         root: 'persoo-custom-per-page-root',
//         toggler: 'persoo-custom-per-page-toggler',
//         select: [
//           'persoo-custom-per-page',
//           'persoo-custom-per-page--subclass'
//         ],
//         item: 'persoo-custom-per-page-option'
//       }
//     }),

//     sortByCustom({
//       container: document.querySelector('#persoo-sort-by-custom'),
//       items: [
//         { label: 'Featured', value: 'instant_search' },
//         { label: 'Price (asc)', value: 'instant_search_price_asc' },
//         { label: 'Price (desc)', value: 'instant_search_price_desc' }
//       ],
//       cssClasses: {
//         root: 'persoo-custom-sort-by-root',
//         toggler: 'persoo-custom-sort-by-toggler',
//         select: [
//           'persoo-custom-sort-by',
//           'persoo-custom-sort-by--subclass'
//         ],
//         item: 'persoo-custom-sort-by-option'
//       }
//     }),

//     hits({
//       container: '#persoo-hits',
//       cssClasses: {
//         root: 'persoo-hits',
//         list: ['persoo-hits-list', 'persoo-hits-list--subclass']
//       },
//       templates: {
//         empty: 'No results for <q>{{ query }}</q>',
//         item: `
//           <div class="persoo-hits-item">
//             <div class="persoo-hits-item-image">
//               <img src="{{image}}" align="left" alt="{{name}}" />
//             </div>

//             <div class="persoo-hits-item-name">
//               {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
//             </div>

//             <div class="persoo-hits-item-description">
//               {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
//             </div>

//             <div class="persoo-hits-item-price">\${{price}}</div>
//           </div>
//         `
//       }
//     }),

//     menu({
//       container: '#persoo-menu',
//       attribute: 'categories',
//       limit: 5,
//       showMore: true,
//       cssClasses: {
//         root: 'persoo-menu',
//         list: [
//           'persoo-menu-list',
//           'persoo-menu-list--sub-class'
//         ]
//       }
//     }),

//     menuSelect({
//       container: '#persoo-menu-select',
//       attribute: 'categories',
//       limit: 5,
//       showMore: true,
//       cssClasses: {
//         root: 'persoo-menu-select',
//         list: [
//           'persoo-menu-select-list',
//           'persoo-menu-select-list--sub-class'
//         ]
//       }
//     }),

//     menuSelectCustom({
//       container: document.querySelector('#persoo-menu-select-custom'),
//       attribute: 'categories',
//       limit: 5,
//       showMore: true,
//       cssClasses: {
//         root: 'persoo-menu-select-custom',
//         list: [
//           'persoo-menu-select-custom-list',
//           'persoo-menu-select-custom-list--sub-class'
//         ]
//       }
//     }),

//     sortBy({
//       container: '#persoo-sort-by',
//       items: [
//         { label: 'Featured', value: 'instant_search' },
//         { label: 'Price (asc)', value: 'instant_search_price_asc' },
//         { label: 'Price (desc)', value: 'instant_search_price_desc' }
//       ]
//     }),

//     hierarchicalMenu({
//       // Docs: https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/
//       // container: string|HTMLElement,
//       // attributes: string[],

//       // Optional parameters:
//       // limit: number,
//       // showMore: boolean,
//       // showMoreLimit: number,
//       // separator: string,
//       // rootPath: string,
//       // showParentLevel: boolean,
//       // sortBy: string[]|function,
//       // templates: object,
//       // cssClassNames: object,
//       // transformItems: function,
//       container: '#persoo-hierarchical-menu',
//       limit: 7,
//       showMore: true,
//       attributes: [
//         'hierarchicalCategories.lvl0',
//         'hierarchicalCategories.lvl1',
//         'hierarchicalCategories.lvl2',
//         'hierarchicalCategories.lvl3'
//       ]
//     }),

//     refinementList({
//       // Docs: https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/
//       // container: string|HTMLElement,
//       // attribute: string,

//       // Optional parameters:
//       // operator: string,
//       // limit: number,
//       // showMore: boolean,
//       // showMoreLimit: number,
//       // searchable: boolean,
//       // searchablePlaceholder: string,
//       // searchableIsAlwaysActive: boolean,
//       // searchableEscapeFacetValues: boolean,
//       // sortBy: string[]|function,
//       // templates: object,
//       // cssClassNamees: object,
//       // transformItems: function,
//       container: '#persoo-refinement-list',
//       attribute: 'brand',
//       limit: 7,
//       showMore: true,
//       searchable: true
//     }),

//     rangeSlider({
//       // Docs: https://www.algolia.com/doc/api-reference/widgets/range-slider/js/
//       // container: string|HTMLElement,
//       // attribute: string,

//       // Optional parameters:
//       // min: number,
//       // max: number,
//       // precision: number,
//       // step: number,
//       // pips: boolean,
//       // tooltips: boolean|object,
//       // cssClasses: object,
//       container: '#persoo-range-slider',
//       attribute: 'price',
//       tooltips: true,
//       pips: false
//     }),
//   ])

//   search.start()
// }, 1500)

console.log('start')
