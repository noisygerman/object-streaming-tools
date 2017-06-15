const assert
  = require( 'assert' );

const asIteratee
  = require( 'lodash/iteratee' );

/**
 * Essentially a streaming version of lodash.keyBy.
 * 
 * From lodash/keyBy ( retrieved November 9, 2016, https://lodash.com/docs/4.16.6#keyBy)
 *
 * Creates an object composed of keys generated from the results of running each
 * element of collection thru iteratee. The corresponding value of each key is
 * the last element responsible for generating the key. The iteratee is invoked
 * with one argument: (value).
 *
 * @note If duplicate entries are found, the entries will be merged. For
 *       conflicts, the last one in wins 
 * 
 * @param {string|number|symbol|function} iteratee
 *   the iteratee to transform keys or the identity of the key
 * 
 * @returns {object} the map stream instance
 */
function createAssignStream( iteratee ){

  assert( iteratee != null, 'Iteratee must be defined' );

  const obj
    = {};

  const extractKey
    = asIteratee( iteratee );

  function transform( properties, _, next ){

    const key = extractKey( properties );

    if( key == null ) return next( new Error( 'Key value must be set' ) );

    const child   
      = obj[ key ]
      = obj[ key ] || {};
    
    Object.assign( child, properties );
    next();

  }

  function flush( done ){

    this.push( obj );
    done();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform,
    flush
  } );

}

module.exports = createAssignStream;
