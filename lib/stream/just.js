/**
 * Streams all arguments provided one-by-one
 *
 * Similar to RxJs 'just' operator, except that it accepts multiple arguments
 * and can, hence, work like from( ...array ) as well
 *
 * @returns {object} a stream that will emit each of the arguments provided
 *
 */
function createJustStream( ...args ){

  function read( n ){

    if( !args.length ) return process.nextTick( this.push.bind( this, null ) );

    while( args.length && n ){

      const item
        = args.shift();

      if( item != null ){

        n--;
        process.nextTick( this.push.bind( this, item ) );

      }

    }


  }

  return require( 'stream' ).Readable( {
    objectMode: true,
    read
  } );

}

module.exports = createJustStream;
