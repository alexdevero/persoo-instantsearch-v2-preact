// https://www.algolia.com/doc/api-reference/widgets/js/

import { Component } from 'preact'
import algoliasearch from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'
import {
  clearRefinements,
  currentRefinements,
  hierarchicalMenu,
  hits,
  hitsPerPage,
  menu,
  numericMenu,
  pagination,
  rangeSlider,
  ratingMenu,
  refinementList,
  searchBox,
  sortBy,
  toggleRefinement
} from 'instantsearch.js/es/widgets'

import './styles/algolia-reset.css'
import './styles/algolia-theme.css'
// import './styles/algolia-satelite.css'
import './styles/style.css'

const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')

setTimeout(function() {
  const search = instantsearch({
    indexName: 'instant_search',
    searchClient
  })

  search.addWidgets([
    searchBox({
      container: '#persoo-searchbox'
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
      cssClasses: {
        root: 'persoo-menu',
        list: [
          'persoo-menu-list',
          'persoo-menu-list--sub-class'
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
      container: '#persoo-brand-list',
      attribute: 'brand',
      limit: 15,
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
      container: '#persoo-price',
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

    clearRefinements({
      container: '#persoo-clear-refinements',
      cssClasses: {
        root: 'persoo-clear-refinements-root',
        button: 'persoo-clear-refinements-button',
        disabledButton: 'persoo-clear-refinements-disabled-button'
      }
    })
  ])

  search.start()
}, 1000)

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="left-panel">
          <div className="categories">
            <h2>Categories</h2>

            <div id="persoo-hierarchical-menu" />
          </div>

          <div className="brands">
            <h2>Brands</h2>

            <div id="persoo-brand-list" />

            <div id="persoo-menu" />

            <div id="persoo-toggle-refinement" />

            <div id="persoo-numeric-menu" />

            <div id="persoo-price" />

            <div id="persoo-rating-menu" />
          </div>
        </div>

        <div className="right-panel">
          <div className="right-panel__results">
            <div id="persoo-searchbox" />

            <div className="search-meta-filters">
              <div id="persoo-clear-refinements" />

              <div id="persoo-current-refinements" />

              <div id="persoo-hits-per-page" />

              <div id="persoo-sort-by" />
            </div>

            <div id="persoo-hits" />
          </div>

          <div id="persoo-pagination" />
        </div>
      </div>
    )
  }
}
