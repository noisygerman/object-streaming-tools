const createAsFileStream
  = require( './asFileStream' );

const path
  = require( 'path' );

const fromArray
  = require( '../stream/fromArray' );

const apply
  = require( '../stream/apply' );

const asyncify
  = require( 'async/asyncify' );

const isEmpty
  = require( 'lodash/isEmpty' );

const isString
  = require( 'lodash/isString' );

/**
 * Emits the contents of files in the directory at dirPath as a continuous,
 * concatenated stream
 *
 * @param {String} dirPath
 *  The path to the directory at which to read the files
 *
 * @param {any} [delimiter]
 *  [optional] delimiter injected between files
 *
 * @returns {Object}
 *  Returns the created transform stream
 */
function concatFiles( dirPath, delimiter ){

  function transform( fileList, _, next ){

    if( isEmpty( fileList ) ) return next();

    const asFileStream
      = createAsFileStream();

    const delimiterString
      = toDelimiterString( delimiter );

    if( delimiterString ){

      asFileStream
        .on( 'eof', injectDelimiter.call( this, fileList, delimiterString ) );

    }

    asFileStream
      .on( 'bof', this.emit.bind( this, 'bof' ) );

    fromArray( fileList )
      .on( 'error', next )
      .pipe( apply( asyncify( path.join.bind( path, dirPath ) ) ) )
      .on( 'error', next )
      .pipe( asFileStream )
      .on( 'error', next )
      .on( 'data', this.push.bind( this ) )
      .on( 'finish', next );

  }

  return require( 'stream' ).Transform( {
    writableObjectMode: true,
    transform
  } );

}

module.exports = concatFiles;

/* internal methods */

function injectDelimiter( filesList, delimiter ){

  let currentIndex
    = 0;

  return ()=>{

    if( ++currentIndex < filesList.length ) this.push( delimiter );

  };

}

function toDelimiterString( delimiter ){

  if( delimiter == null ) return;

  const delimiterString
    = isString( delimiter )
      ? delimiter
      : JSON.stringify( delimiter );

  if( delimiterString.length === 0 ) return;
  return delimiterString;

}
