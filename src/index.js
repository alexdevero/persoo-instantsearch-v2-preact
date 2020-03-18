// https://www.algolia.com/doc/api-reference/widgets/js/

import { Component } from 'preact'
import algoliasearch from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'

// Import default widgets
import {
  clearRefinements,
  currentRefinements,
  hierarchicalMenu,
  hits,
  hitsPerPage,
  menu,
  menuSelect,
  numericMenu,
  pagination,
  panel,
  rangeInput,
  rangeSlider,
  ratingMenu,
  refinementList,
  searchBox,
  sortBy,
  stats,
  toggleRefinement
} from 'instantsearch.js/es/widgets'

// Import Algolia connectors
import { connectHitsPerPage } from 'instantsearch.js/es/connectors'
import { connectSortBy } from 'instantsearch.js/es/connectors'

// Import custom widgets
import { renderHitsPerPageCustom } from './widgets/hits-per-page-custom'
import { renderSortByCustom } from './widgets/sort-by-custom'

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

// Import main stylesheet
import './styles/style.css'

const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')

setTimeout(function() {
  const search = instantsearch({
    indexName: 'instant_search',
    searchClient
  })

  const hitsPerPageCustom = connectHitsPerPage(renderHitsPerPageCustom)
  const sortByCustom = connectSortBy(renderSortByCustom)

  const refinementListWithPanel = panel({
    templates: {
      header: 'Brand'
    }
  })(refinementList)

  search.addWidgets([
    // refinementListWithPanel({
    //   container: '#refinement-list-with-panel',
    //   attribute: 'brand'
    // }),

    searchBox({
      container: '#persoo-searchbox'
    }),

    hitsPerPageCustom({
      container: document.querySelector('#persoo-hits-per-page-custom'),
      items: [
        { label: '8 per page', value: 8, default: true },
        { label: '16 per page', value: 16 },
        { label: '32 per page', value: 32 }
      ],
      cssClasses: {
        root: 'persoo-custom-per-page-root',
        toggler: 'persoo-custom-per-page-toggler',
        select: [
          'persoo-custom-per-page',
          'persoo-custom-per-page--subclass'
        ],
        item: 'persoo-custom-per-page-option'
      }
    }),

    sortByCustom({
      container: document.querySelector('#persoo-sort-by-custom'),
      items: [
        { label: 'Featured', value: 'instant_search' },
        { label: 'Price (asc)', value: 'instant_search_price_asc' },
        { label: 'Price (desc)', value: 'instant_search_price_desc' }
      ],
      cssClasses: {
        root: 'persoo-custom-sort-by-root',
        toggler: 'persoo-custom-sort-by-toggler',
        select: [
          'persoo-custom-sort-by',
          'persoo-custom-sort-by--subclass'
        ],
        item: 'persoo-custom-sort-by-option'
      }
    }),

    hits({
      container: '#persoo-hits',
      cssClasses: {
        root: 'persoo-hits',
        list: ['persoo-hits-list', 'persoo-hits-list--subclass']
      },
      templates: {
        empty: 'No results for <q>{{ query }}</q>',
        item: `
          <div className="persoo-hits-item">
            <img src="{{image}}" align="left" alt="{{name}}" />

            <div className="persoo-hits-item-name">
              {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
            </div>

            <div className="persoo-hits-item-description">
              {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
            </div>

            <div className="persoo-hits-item-price">\${{price}}</div>
          </div>
        `
      }
    }),

    currentRefinements({
      container: '#persoo-current-refinements',
      cssClasses: {
        root: 'persoo-refinement-root',
        list: 'persoo-refinement-list',
        item: 'persoo-refinement-item',
        label: 'persoo-refinement-label',
        category: 'persoo-refinement-category',
        categoryLabel: 'persoo-refinement-category-label',
        delete: 'persoo-refinement-delete'
      }
    }),

    pagination({
      container: '#persoo-pagination',
      cssClasses: {
        root: 'persoo-pagination',
        noRefinementRoot: 'persoo-pagination--empty',
        list: 'persoo-pagination-list',
        item: 'persoo-pagination-item',
        firstPageItem: 'persoo-pagination-first-page-item',
        lastPageItem: 'persoo-pagination-last-page-item',
        previousPageItem: 'persoo-pagination-previous-page-item',
        nextPageItem: 'persoo-pagination-next-page-item',
        pageItem: 'persoo-pagination-page-item',
        selectedItem: 'persoo-pagination-selected-item',
        disabledItem: 'persoo-pagination-disabled-item',
        link: 'persoo-pagination-link'
      }
    }),

    menu({
      container: '#persoo-menu',
      attribute: 'categories',
      limit: 5,
      showMore: true,
      cssClasses: {
        root: 'persoo-menu',
        list: [
          'persoo-menu-list',
          'persoo-menu-list--sub-class'
        ]
      }
    }),

    menuSelect({
      container: '#persoo-menu-select',
      attribute: 'categories',
      limit: 5,
      showMore: true,
      cssClasses: {
        root: 'persoo-menu-select',
        list: [
          'persoo-menu-select-list',
          'persoo-menu-select-list--sub-class'
        ]
      }
    }),

    sortBy({
      container: '#persoo-sort-by',
      items: [
        { label: 'Featured', value: 'instant_search' },
        { label: 'Price (asc)', value: 'instant_search_price_asc' },
        { label: 'Price (desc)', value: 'instant_search_price_desc' }
      ]
    }),

    hitsPerPage({
      container: '#persoo-hits-per-page',
      items: [
        { label: '8 hits per page', value: 8, default: true },
        { label: '16 hits per page', value: 16 },
        { label: '32 hits per page', value: 32 }
      ],
      cssClasses: {
        root: 'persoo-hits-per-page',
        select: [
          'persoo-hits-per-page-select',
          'persoo-hits-per-page-select--subclass',
        ]
      }
    }),

    hierarchicalMenu({
      // Docs: https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/
      // container: string|HTMLElement,
      // attributes: string[],

      // Optional parameters:
      // limit: number,
      // showMore: boolean,
      // showMoreLimit: number,
      // separator: string,
      // rootPath: string,
      // showParentLevel: boolean,
      // sortBy: string[]|function,
      // templates: object,
      // cssClassNamees: object,
      // transformItems: function,
      container: '#persoo-hierarchical-menu',
      limit: 7,
      showMore: true,
      attributes: [
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
        'hierarchicalCategories.lvl3'
      ]
    }),

    refinementList({
      // Docs: https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/
      // container: string|HTMLElement,
      // attribute: string,

      // Optional parameters:
      // operator: string,
      // limit: number,
      // showMore: boolean,
      // showMoreLimit: number,
      // searchable: boolean,
      // searchablePlaceholder: string,
      // searchableIsAlwaysActive: boolean,
      // searchableEscapeFacetValues: boolean,
      // sortBy: string[]|function,
      // templates: object,
      // cssClassNamees: object,
      // transformItems: function,
      container: '#persoo-refinement-list',
      attribute: 'brand',
      limit: 7,
      showMore: true,
      searchable: true
    }),

    rangeSlider({
      // Docs: https://www.algolia.com/doc/api-reference/widgets/range-slider/js/
      // container: string|HTMLElement,
      // attribute: string,

      // Optional parameters:
      // min: number,
      // max: number,
      // precision: number,
      // step: number,
      // pips: boolean,
      // tooltips: boolean|object,
      // cssClasses: object,
      container: '#persoo-range-slider',
      attribute: 'price',
      tooltips: true,
      pips: false
    }),

    toggleRefinement({
      container: '#persoo-toggle-refinement',
      attribute: 'free_shipping',
      cssClasses: {
        root: 'persoo-toggle-refinment-root',
        label: 'persoo-toggle-refinment-label',
        checkbox: 'persoo-toggle-refinment-checkbox',
        labelText: 'persoo-toggle-refinment-labelText'
      },
      templates: {
        labelText: 'Free shipping'
      }
    }),

    numericMenu({
      container: '#persoo-numeric-menu',
      attribute: 'price',
      items: [
        { label: 'All' },
        { label: 'Less than 500$', end: 500 },
        { label: 'Between 500$ - 1000$', start: 500, end: 1000 },
        { label: 'More than 1000$', start: 1000 }
      ]
    }),

    ratingMenu({
      container: '#persoo-rating-menu',
      attribute: 'rating',
      max: 5,
      cssClasses: {
        root: 'persoo-rating-menu-root',
        noRefinementRoot: 'persoo-rating-menu-no-refinement-root',
        list: 'persoo-rating-menu-list',
        item: 'persoo-rating-menu-item',
        selectedItem: 'persoo-rating-menu-selected-item',
        disabledItem: 'persoo-rating-menu-disabled-item',
        starIcon: 'persoo-rating-menu-starIcon',
        fullStarIcon: 'persoo-rating-menu-full-star-icon',
        emptyStarIcon: 'persoo-rating-menu-empty-star-icon',
        label: 'persoo-rating-menu-label',
        count: 'persoo-rating-menu-count'
      }
    }),

    rangeInput({
      container: '#persoo-range-input',
      attribute: 'price'
    }),

    clearRefinements({
      container: '#persoo-clear-refinements',
      cssClasses: {
        root: 'persoo-clear-refinements-root',
        button: 'persoo-clear-refinements-button',
        disabledButton: 'persoo-clear-refinements-disabled-button'
      }
    }),

    stats({
      container: '#persoo-stats',
      cssClasses: {
        root: 'persoo-stats-root',
        text: ['persoo-stats-text', 'persoo-stats-text--subclass']
      }
    }),

    searchBox({
      container: '#persoo-searchbox'
    })
  ])

  search.start()
}, 1000)

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="left-panel">
          <div id="persoo-filters-toggle">
            Filtry
          </div>

          <div className="categories">
            <h3>Categories</h3>

            <div id="persoo-hierarchical-menu" />
          </div>

          <div className="brands">
            <h3>Refinement list with panel</h3>

            <div id="#refinement-list-with-panel" />

            <h3>Refinement list</h3>

            <div id="persoo-refinement-list" />

            <h3>Menu</h3>

            <div id="persoo-menu" />

            <h3>Menu select</h3>

            <div id="persoo-menu-select" />

            <h3>Toggle refinement</h3>

            <div id="persoo-toggle-refinement" />

            <h3>Numeric menu</h3>

            <div id="persoo-numeric-menu" />

            <h3>Range slider</h3>

            <div id="persoo-range-slider" />

            <h3>Range input</h3>

            <div id="persoo-range-input" />

            <h3>Rating menu</h3>

            <div id="persoo-rating-menu" />
          </div>
        </div>

        <div className="right-panel">
          <div className="right-panel__results">
            <div id="persoo-searchbox" />

            <div className="search-meta-filters">
              <div>
                <h5>Stats</h5>
                <div id="persoo-stats" />
              </div>

              <div>
                <h5>Hits per page</h5>
                <div id="persoo-hits-per-page" />
              </div>

              <div>
                <h5>Custom hits per page</h5>
                <div id="persoo-hits-per-page-custom" />
              </div>

              <div>
                <h5>Sort by</h5>
                <div id="persoo-sort-by" />
              </div>

              <div>
                <h5>Custom sort by</h5>
                <div id="persoo-sort-by-custom" />
              </div>
            </div>

            <div className="search-meta-filters">
              <div>
                <h5>Clear refinements</h5>
                <div id="persoo-clear-refinements" />
              </div>

              <div>
                <h5>Current refinements</h5>
                <div id="persoo-current-refinements" />
              </div>
            </div>

            <div id="persoo-hits" />
          </div>

          <div id="persoo-pagination" />
        </div>
      </div>
    )
  }
}
