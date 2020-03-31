const assert = require( 'assert' );
const asIteratee = require( 'lodash/iteratee' );

const DuplicateEventKey = 'rejected';

/**
 * Emits only unique inputs based on the given attributeName via the 'data' event
 * and through the pipe. Duplicated items are emitted via the 'duplicate' event.
 *
 * @param {IterateeFunction} iteratee
 *  The iteratee function invoked per element
 *
 * @constant {String} DuplicateEventKey
 *  The key of the event emitted when duplicate items are found.
 *
 * @returns {object}
 *  returns a Transform stream that applies the provided iteratee to emit only unique items
 *
 * @callback IterateeFunction
 * @param {any} item
 *  input parameter for the iteratee function to return the value that will be evaluated to be unique
 * @returns {any}
 */

function createUniqueByStream( iteratee ){

  assert( iteratee != null, 'Iteratee must be defined' );

  const cache = [];

  const extractValue = asIteratee( iteratee );

  function transform( item, _, next ){
    
    const v = extractValue( item );

    if( cache.includes( v ) ){

      this.emit( DuplicateEventKey, item );
    
    } else {

      cache.push( v );
      this.push( item );
    
    }
    next();
  
  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createUniqueByStream;
module.exports.DuplicateEventKey = DuplicateEventKey;
