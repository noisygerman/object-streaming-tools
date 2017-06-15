const assert
  = require( 'assert' );

const asIteratee
  = require( 'lodash/iteratee' );

/**
 * Streaming version of lodash.groupBy
 * 
 * From lodash/groupBy ( retrieved November 9, 2016, https://lodash.com/docs/4.16.6#groupBy )
 *
 * Creates an object composed of keys generated from the results of running each
 * element of collection thru iteratee. The order of grouped values is determined
 * by the order they occur in collection. The corresponding value of each key is
 * an array of elements responsible for generating the key.
 * The iteratee is invoked with one argument: (value).
 * 
 * @param {string|number|symbol|function} iteratee
 *   the iteratee to transform keys or the identity of the key
 * 
 * @returns {object} the map stream instance
 */
function createAssignStream( iteratee ){

  assert( iteratee != null, 'Iteratee must be defined' );

  let groups
    = {};

  const extractKey
    = asIteratee( iteratee );

  function transform( properties, _, next ){

    const key = extractKey( properties );

    if( key == null ) return next( new Error( 'Key value must be set' ) );

    const group   
      = groups[ key ]
      = groups[ key ] || [];
    
    group.push( properties );
    next();

  }

  function flush( done ){

    const result = groups; // eslint-disable-line newline-after-var
    groups       = null;

    this.push( result );
    done();

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform,
    flush
  } );

}

module.exports = createAssignStream;
