import Cache from './cache'
import { normalizeQuery, hashCode, throttle } from './utils'

const DEBUG_SERVER = false // true
const DEBUG_LOCAL = true // true

/**
  How alolia instantsearch works:
  https://github.com/algolia/algoliasearch-helper-js/blob/develop/src/algoliasearch.helper.js
  helper.search() only builds search query from state and calls client.search(queries, dispatchCallback)
  dispatchCallback([states, queryID], error, content)
      first 2 params are bound so client.search() do not see them
      if (error) do nothing
      if (queryID received is too old, then throw it away and do nothing
      else process content ... call 'results' event causing render()
  Thus we do:
      if there are too many request in the queue, then skip them (do nothing).
      but make sure that results for final query will arrive, otherwise no render() is called.
  TODO funther improvements: remember 'searching' status. In case server did not respond yet, do not trigger
        search query and postpone it. (but have some max timelimit)
*/

function translateResponse(data, persooEventProps) {
  // receivedData = translateResponse(data, persooEventProps)
  if (DEBUG_LOCAL) console.log('translateResponse data:', data)
  if (DEBUG_LOCAL) console.log('translateResponse persooEventProps:', persooEventProps)

  function translateAggregationGroup(aggregationsGroup) {
    var map = {}

    for (var i = 0; i < aggregationsGroup.length; i++) {
      var aggItem = aggregationsGroup[i]
      map[aggItem.value] = aggItem.count // note: values with '>' will not be displayed
    }

    return map
  }

  var result = {
    hits: data.items,
    hitsPerPage: data.itemsPerPage,
    page: data.page,
    nbHits: data.itemsCount,
    nbPages: data.pagesCount,
    query: persooEventProps.query,
    index: persooEventProps.index,
    facets: {},
    facets_stats: {}
  }

  if (data.aggregations) {
    for (var group in data.aggregations) {
      if (persooEventProps.aggregations.indexOf(group) >= 0) {
        var groupData = data.aggregations[group]

        if (groupData.numeric) {
          result.facets_stats[group] = groupData.numeric
          var avg = groupData.numeric.avg || 0
          result.facets[group] = {}
          result.facets[group][avg] = 1
          // result.facets[group] = {"123": 123}; // algolia requires facet, too. So proivide value which nobody uses.
        }

        if (groupData.terms || !groupData.numeric) {
          result.facets[group] = translateAggregationGroup(groupData.terms)
        }
      }
    }
  }

  return result
}

function parseExternalRequestID(str) {
  var parts = str.split('_')

  return {
    number: parseInt(parts[0]),
    pos: parseInt(parts[1])
  }
}

function createMergePersooResponsesToBatchCallback(algoliaCallback, requestsCount, cache) {
  var receivedRequestCount = 0
  var results = []
  var isError = false

  return function(persooEventProps, queryHash, data) {
    receivedRequestCount++
    cache.set(queryHash, data)

    if (typeof data.itemsCount == 'undefined' || typeof data.externalRequestID == 'undefined') {
      isError = true
      console.log('Persoo server response: does not contain requiered data. Do you call existing algorithmID?')
    } else {
      var externalRequestID = parseExternalRequestID(persooEventProps.externalRequestID)
      var receivedExternalRequestID = parseExternalRequestID(data.externalRequestID)

      if (externalRequestID.number == receivedExternalRequestID.number) {
        var receivedData

        if (data) {
          receivedData = translateResponse(data, persooEventProps)
        } else {
          receivedData = translateResponse({}, persooEventProps)
        }

        results[receivedExternalRequestID.pos] = receivedData

        if (DEBUG_SERVER) {
          console.log('... Receiving data ' + data.externalRequestID + ' from Persoo: ' + data.items.length + ' items.')
        }

        if (externalRequestID.pos != receivedExternalRequestID.pos) {
          console.error(' Requested part ' + externalRequestID.pos + ' but received part ' + receivedExternalRequestID.pos + '!')
        }
      } else if (externalRequestID.number > receivedExternalRequestID.number) {
        if (DEBUG_SERVER) {
          console.log('... Receiving and ignoring old data ' + data.externalRequestID + ' from Persoo.')
        }
      } else {
        if (DEBUG_SERVER) {
          console.log('... Ops, receiving future data ' + data.externalRequestID + ' from Persoo.')
        }
      }
    }

    if (receivedRequestCount >= requestsCount) {
      algoliaCallback(isError, {results: results})
    }
  }
}

function addCustomRuleToQuery(query, field, operator, value) {
  if (query && query.must) {
    query.must.push({
      type: 'customRule',
      fields: [field, operator, 'value', JSON.stringify(value)]
    })

    // TODO: change it to new ProductSearch format
  }
}

function preparePersooRequestProps(options, params, indexWithSort) {
  if (DEBUG_LOCAL) console.log('preparePersooRequestProps params: ', params)
  if (DEBUG_LOCAL) console.log('preparePersooRequestProps options: ', options)

  var persooProps = {
    _e: 'getRecommendation',
    algorithmID: options.algorithmID,
    offerID: options.offerID || 'default',
    locationID: options.locationID || 'default',
    query: params.query,
    itemsPerPage: params.hitsPerPage,
    page: params.page,
    index: indexWithSort.replace(/_.*$/, ''),

    maxValuesPerFacet: params.maxValuesPerFacet,
    aggregations: (Array.isArray(params.facets) ? params.facets : ((params.facets && [params.facets]) || [])),
    // includeFields: []
    boolQuery: params.boolQuery || {}
  }

  // ? INFO: When filter for boolQuery is used:
  // For price bigger than 7218
  // boolQuery: { "must":[{ "type":"customRule","fields": ["price", "$gte", "value", "7218"] }] }
  // For price lower than 7218
  // boolQuery: { "must":[{ "type":"customRule","fields": ["price", "$lte", "value", "7218"] }] }

  if (DEBUG_LOCAL) console.log('preparePersooRequestProps persooProps: ', persooProps)

  var boolQuery = { must: [] }

  // translate
  // "facetFilters":[["key:value1", "key:value2"]]}
  // to
  // persooProps[key]: ["value1", "value2"]
  var facetFilters = params.facetFilters || []
  for (var j = 0; j < facetFilters.length; j++) {
    var facetFilter = facetFilters[j]

    for (var k = 0; k < facetFilter.length; k++) {
      var filterItem = facetFilters[j][k]
      var separatorPos = filterItem.indexOf(':')
      var field = filterItem.substring(0, separatorPos)
      var value = filterItem.substring(separatorPos + 1)

      // Manually fix boolean values for refinements parsed as string
      value = value === 'true' ? true : value

      // join values with the same key to array
      if (persooProps[field]) {
        if (Array.isArray(persooProps[field])) {
          persooProps[field].push(value)
        } else {
          persooProps[field] = [persooProps[field], value]
        }
      } else {
        persooProps[field] = value
      }
    }

    addCustomRuleToQuery(boolQuery, field, '$in', persooProps[field])
  }

  // translate
  //    "numericFilters":["price<=1548"]}
  // to
  //    persooProps["price_lte"]: 1548
  var numericFilters = params.numericFilters || [];

  for (var i = 0; i < numericFilters.length; i++) {
    var num_parts = numericFilters[i].split(/\b/)
    var num_field = num_parts[0]
    // Hack for negative values
    // Symbol for negative values are parsed with minus '-' sign
    // i.e.: '>=' becomes '>='
    // As a result, symbol can't be found in convertOp variable
    var num_value = num_parts[1].indexOf('-') > -1 ? '-' + parseFloat(num_parts[2]) : parseFloat(num_parts[2])
    var num_operator = num_parts[1].replace(/-/g, '')
    var convertOp = {
      '>': 'gt',
      '<': 'lt',
      '>=': 'gte',
      '<=': 'lte'
    }

    persooProps[num_field + '_' + convertOp[num_operator]] = num_value
    addCustomRuleToQuery(boolQuery, num_field, '$' + convertOp[num_operator], num_value)
  }

  if (boolQuery.must.length > 0) {
    persooProps.boolQuery = boolQuery
  }

  // Get Sort options if any
  var indexParts = indexWithSort.split('_');
  if (indexParts.length > 2) {
    var sortField = indexParts[indexParts.length - 2]
    var sortOrder = indexParts[indexParts.length - 1]

    persooProps.sortByField = sortField
    persooProps.sortOrder = sortOrder.toLowerCase()
  }

  return persooProps
}

export default class PersooInstantSearchClient {
  constructor(options) {
    this.options = options
    this.options.requestThrottlingInMs = this.options.requestThrottlingInMs || 200
    this.cache = new Cache()
    this.statistics = {
      batchRequestCount: 0
    }

    // var algoliaContent = {
    //   "hits": [
    //     {
    //       "name": "Nintendo - amiibo Figure (The Legend of Zelda: Breath of the Wild Series Bokoblin)",
    //       "description": "These creatures have appeared in many games in the Legend of Zelda series, but never have they been more dangerous and resourceful. This amiibo features a standard red Bokoblin carrying a rudimentary Boko Club, but many nastier varieties lurk in the wilds of Hyrule.",
    //       "brand": "Nintendo",
    //       "categories": [
    //         "Video Games",
    //         "Toys to Life",
    //         "Amiibo"
    //       ],
    //       "hierarchicalCategories": {
    //         "lvl0": "Video Games",
    //         "lvl1": "Video Games > Toys to Life",
    //         "lvl2": "Video Games > Toys to Life > Amiibo"
    //       },
    //       "type": "Toy 2 life character",
    //       "price": 15.99,
    //       "price_range": "1 - 50",
    //       "image": "https://cdn-demo.algolia.com/bestbuy-0118/5723548_sb.jpg",
    //       "url": "https://api.bestbuy.com/click/-/5723548/pdp",
    //       "free_shipping": false,
    //       "rating": 0,
    //       "popularity": 21450,
    //       "objectID": "5723548",
    //       "_highlightResult": {
    //         "name": {
    //           "value": "Nintendo - amiibo Figure (The Legend of Zelda: Breath of the Wild Series Bokoblin)",
    //           "matchLevel": "none",
    //           "matchedWords": []
    //         },
    //         "description": {
    //           "value": "These creatures have appeared in many games in the Legend of Zelda series, but never have they been more dangerous and resourceful. This amiibo features a standard red Bokoblin carrying a rudimentary Boko Club, but many nastier varieties lurk in the wilds of Hyrule.",
    //           "matchLevel": "none",
    //           "matchedWords": []
    //         },
    //         "brand": {
    //           "value": "Nintendo",
    //           "matchLevel": "none",
    //           "matchedWords": []
    //         },
    //         "categories": [
    //           {
    //             "value": "Video Games",
    //             "matchLevel": "none",
    //             "matchedWords": []
    //           },
    //           {
    //             "value": "Toys to Life",
    //             "matchLevel": "none",
    //             "matchedWords": []
    //           },
    //           {
    //             "value": "Amiibo",
    //             "matchLevel": "none",
    //             "matchedWords": []
    //           }
    //         ],
    //         "type": {
    //           "value": "Toy 2 life character",
    //           "matchLevel": "none",
    //           "matchedWords": []
    //         }
    //       }
    //     }
    //   ],
    //   "nbHits": 1,
    //   "page": 0,
    //   "nbPages": 1,
    //   "hitsPerPage": 20,
    //   "exhaustiveNbHits": true,
    //   "query": "",
    //   "queryAfterRemoval": "",
    //   "params": "highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&facets=%5B%5D&tagFilters=",
    //   "index": "instant_search",
    //   "processingTimeMS": 1
    // }

    var cache = this.cache;
    var statistics = this.statistics;

    var optionsSearch = this.options

    function searchFunction(query, i) {
      // query: {"indexName":"instant_search","params":{"highlightPreTag":"__ais-highlight__","highlightPostTag":"__/ais-highlight__","facets":[],"tagFilters":""}}

      if (DEBUG_LOCAL) console.log('searchFunction query: ', query)

      return new Promise(function(resolve, reject) {
        // var queryId = statistics.batchRequestCount
        var params = {
          hitsPerPage: query.params.hitsPerPage || 8,
          maxValuesPerFacet: query.params.maxValuesPerFacet || 20,
          page: query.params.page || 0,
          query: query.params.query || '',
          tagFilters: query.params.tagFilters || '',
          facets: query.params.facets || [],
          facetFilters: query.params.facetFilters || [],
          // boolQuery: query.params.boolQuery || {},
          numericFilters: query.params.numericFilters || []
        }

        if (DEBUG_LOCAL) console.log('searchFunction params: ', params)

        var persooProps = preparePersooRequestProps(optionsSearch, params, query.indexName)
        var queryHash = hashCode(JSON.stringify(persooProps)) // without requestID
        var externalRequestID = statistics.batchRequestCount + '_' + i

        persooProps.externalRequestID = externalRequestID

        if (DEBUG_SERVER) {
          console.log('... persoo.send('  + JSON.stringify(persooProps) + ')')
        }

        var cachedResponse = cache.get(queryHash);
        if (cachedResponse) {
          if (DEBUG_SERVER) {
            console.log('... Serving data from cache: ' + JSON.stringify(cachedResponse.items.length) + ' items.')
          }

          cachedResponse.externalRequestID = externalRequestID

          resolve(cachedResponse)
          // mergeCallback(persooProps, queryHash, cachedResponse)
        } else {
          persoo('send', persooProps, function(data) {
            // resolve(data)
            var receivedData = translateResponse(data, persooProps)
            resolve(receivedData)
            // resolve(algoliaContent)
          })

          persoo('onError', function() {
            reject({ error: {message: 'Persoo server error'}})
          })
        }
      })
    }

    function searchFunctionBatch(queries) {
      // queries: [{"indexName":"instant_search","params":{"highlightPreTag":"__ais-highlight__","highlightPostTag":"__/ais-highlight__","facets":[],"tagFilters":""}}]

      if (DEBUG_SERVER) {
        console.log('persooInstantSearchClient.search(' + JSON.stringify(queries) + ')')
      }

      statistics.batchRequestCount++

      var promisesToBeResolved = []

      for (var pIdx = 0; pIdx < queries.length; pIdx++) {
        promisesToBeResolved.push(
          searchFunction(queries[pIdx], pIdx)
        )
      }

      return new Promise(function(resolve, reject) {
        Promise.all(promisesToBeResolved)
          .then(function(data) {
            resolve({ results: data })
          })
          .catch(function(err) {
            reject(err)
          })
      })

      // Algolia Client accepts batch requests, i.e. list of requests, one request is i.e.
      // [{"indexName":"YourIndexName","params":{"query":"a","hitsPerPage":20,"page":0,"facets":[],"tagFilters":""}}]

      // Note: send requests to Persoo in opposite order, so the primary requests is the last because of algorithm
      // debugging in Persoo. (widget waits for all requests before rerendering, so it does not matter)
      // var requestsCount = requests.length
      // var mergeCallback = createMergePersooResponsesToBatchCallback(algoliaCallback, requestsCount, cache)

      // for (var i = requestsCount - 1; i >= 0; i--) {
      //   var request = requests[i]
      //   var params = request.params
      //   var indexWithSort = request.indexName

      //   var persooProps = preparePersooRequestProps(options, params, indexWithSort)
      //   var queryHash = hashCode(JSON.stringify(persooProps)) // without requestID
      //   var externalRequestID = statistics.batchRequestCount + '_' + i

      //   persooProps.externalRequestID = externalRequestID

      //   if (DEBUG_SERVER) {
      //     console.log('... persoo.send('  + JSON.stringify(persooProps) + ')')
      //   }

      //   var cachedResponse = cache.get(queryHash);
      //   if (cachedResponse) {
      //     if (DEBUG_SERVER) {
      //       console.log('... Serving data from cache: ' + JSON.stringify(cachedResponse.items.length) + ' items.')
      //     }

      //     cachedResponse.externalRequestID = externalRequestID
      //     mergeCallback(persooProps, queryHash, cachedResponse)
      //   } else {
      //     persoo('send', persooProps, mergeCallback.bind(this, persooProps, queryHash))

      //     // empty 'data' in mergeCallback are interpretted as error
      //     persoo('onError', mergeCallback.bind(this, persooProps, queryHash, {}))
      //   }
      // }
    }

    // TODO: implement searchForFacetValues for searchable refinementList
    function searchForFacetValues(queries) {
      // https://github.com/algolia/algoliasearch-client-javascript/blob/e6dec843932bdfaac13ffa1e0a11964975499078/packages/client-search/src/methods/client/multipleSearchForFacetValues.ts

      // ! Persoo use: brand | prefix search by variable session.lastEvent[query]

      const {
        facetName,
        facetQuery,
        facets,
        highlightPostTag,
        highlightPreTag,
        hitsPerPage,
        maxFacetHits,
        maxValuesPerFacet,
        page,
        query,
        tagFilters,
      } = queries[0].params

      // return Promise.all(
      //   queries.map(function(query) {
      //     console.log(query)
      //     const { facetName, facetQuery, ...params } = query.params
      //   })
      // )

      var searchForFacetValuesParams = {
        hitsPerPage: queries[0].params.hitsPerPage || 8,
        maxValuesPerFacet: queries[0].params.maxValuesPerFacet || 20,
        page: queries[0].params.page || 0,
        query: facetQuery,
        tagFilters: queries[0].params.tagFilters || '',
        facets: facetName || [],
        facetFilters: queries[0].params.facetFilters || [],
        // boolQuery: {
        //   must: [
        //     {
        //       type: 'customRule',
        //       fields: [
        //         facetName,
        //         '$in',
        //         'value',
        //         facetQuery
        //       ]
        //     }
        //   ]
        // }
      }

      const persooProps = preparePersooRequestProps(optionsSearch, searchForFacetValuesParams, queries[0].indexName)

      return new Promise(function(resolve, reject) {
        persoo('send', persooProps, function(data) {
          // resolve(data)
          var receivedData = translateResponse(data, persooProps)

          // facets: {Jurek: 93}
          const response = []

          for (const facetObjProp in receivedData.facets[facetName]) {
            // const prefix = facetObjProp.substring(0, facetObjProp.indexOf((facetQuery)))
            // const postfix = facetObjProp.substring(facetObjProp.indexOf((facetQuery)) + facetQuery.length)

            // !! HACK
            // Normalize strings - remove accents and diacritics (á => a, é => e)
            const normalizedFacet = facetObjProp.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const normalizedQuery = facetQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

            // !! HACK
            // Allow only values that contain searched string
            if (normalizedFacet.toLocaleLowerCase().indexOf(normalizedQuery.toLowerCase()) > -1) {
              response.push({
                value: facetObjProp,
                count: receivedData.facets[facetName][facetObjProp],
                highlighted: facetObjProp + '__ais-highlight__' + '__/ais-highlight__'
              })
            }
          }

          const facetHits = receivedData.facets[facetName]
          console.log('receivedData: ', facetHits, receivedData)

          resolve({
            // ! Resolved data:
            //   facetHits: [
            //     {
            //       value: 'Apple',
            //       highlighted: '__ais-highlight__A__/ais-highlight__pple',
            //       count: 442
            //     },
            //     {
            //       value: 'Asus',
            //       highlighted: '__ais-highlight__A__/ais-highlight__sus',
            //       count: 142
            //     },
            //   ],
            //   exhaustiveFacetsCount: true,
            //   processingTimeMS: 1
            // }
            facetHits: response,
            exhaustiveFacetsCount: true,
            processingTimeMS: 1
          })
        })
      })

      // persoo('send', persooProps, function(data) {
      //   // resolve(data)
      //   var receivedData = translateResponse(data, persooProps)
      //   console.log('receivedData: ', receivedData)
      //   // resolve(receivedData)
      //   // resolve(algoliaContent)
      // })

      // searchFunction(queries[0], 0)
      //   .then(function(data) {
      //     console.log('data: ', data)
      //   })

      // return new Promise(function(resolve, reject) {
      //   // ? Resolve dummy data for reverse-engineering
      //   resolve({
      //     facetHits: [
      //       {
      //         value: 'Apple',
      //         highlighted: '__ais-highlight__A__/ais-highlight__pple',
      //         count: 442
      //       },
      //       {
      //         value: 'Asus',
      //         highlighted: '__ais-highlight__A__/ais-highlight__sus',
      //         count: 142
      //       },
      //     ],
      //     exhaustiveFacetsCount: true,
      //     processingTimeMS: 1
      //   })
      // })
    }

    // throttle requests for people who type extremly fast
    // var searchFunctionBatchThrottled = throttle(searchFunctionBatch, this.options.requestThrottlingInMs, false)

    return {
      addAlgoliaAgent: function() {},
      search: searchFunctionBatch, // searchFunctionBatchThrottled
      // TODO: implement searchForFacetValues for searchable refinementList
      searchForFacetValues: searchForFacetValues
    }
  }
}
