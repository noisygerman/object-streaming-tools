const fromArray
  = require( './fromArray' );

const apply
  = require( './apply' );

const filter
  = require( './filter' );

const asyncify
  = require( 'async/asyncify' );

/**
 * Transform stream that finds the index of the streamed in items in the given array based on the compare function
 *
 * @param { array } arr
 *   The array to compare the streamed items to
 *
 * @param { function } compare
 *   Asynchronous function that compares items to each element in the array
 *   Must be of the form ( streamedItem, arrayItem, compareCallback ), where compareCallback returns a truthy value
 *   when the two items match.
 *
 * @returns { object }
 *   A transform stream that takes items and emits the matching indices in the given array
 */
function createFindIndexStream( arr, compare ){

  function transform( item, _, next ){

    const fromSearchArray
      = fromArray( arr );

    let index
      = -1;

    let isFound
      = false;

    const predicate
      = compare.bind( null, item );

    function incrementIndex( listItem ){

      index++;
      return listItem;

    }

    function onError( err ){

      if( isFound ) return;
      next( err );

    }

    fromSearchArray
      .on( 'error', onError )
      .pipe( apply( asyncify( incrementIndex ) ) )
      .on( 'error', onError )
      .pipe( filter( predicate ) )
      .on( 'error', onError )
      .on( 'data', ()=>{

        if( isFound ) return;

        isFound = true;
        fromSearchArray.unpipe();
        next( null, index );

      } )
      .on( 'finish', ()=>{

        if( isFound ) return;
        next( null, -1 );

      } );

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createFindIndexStream;
