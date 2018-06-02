const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');
const TOKEN = require('./src/Token'); // Inseri seu token
const bot = new TelegramBot(TOKEN, { polling: true})
const URL_BASE = `https://www.google.com.br/search?q=`;
const URL_IMAGE = `http://3.bp.blogspot.com/-Y5qrUPXZEwU/WvjY0OJk9lI/AAAAAAAADR4/CxkZ7NSD3uMGhlC8amcuP0-koH68Ab1FQCK4BGAYYCw/s1600/PostersIMAXHD.png`
/*
const from = { 
      id: Number,
      first_name: String,
      last_name: String,
      username: String 
    }
         
    const chat = { 
      id: Number,
      first_name: String,
      last_name: String,
      username: String,
      type: String 
    }
    const Schema = { 
      message_id: Number,
      from,
      chat,
      date: Number,
      text: String
    }
*/
bot.on( 'message', ( msg ) => console.log( 'msg', msg ) )

const logErrorEcho = ( msg ) => ( err ) => console.log( msg, err )

const logSuccessEcho = ( msg, match ) => ( data ) => console.log( `Success: `, data )

const sendEcho = ( msg, match ) => bot.sendMessage( msg.chat.id, match[ 1 ] )
      .then( logSuccessEcho( msg, match ) )
      .catch( logErrorEcho( `Error: ` ) )

bot.onText( /\/echo (.*)/, sendEcho )

const log = (msg) => (result) => console.log(msg, result)

const getURLFrom = (elem, $) =>
    $(elem).attr(`href`)
      .replace(`/url?q=`, ``)
      .replace(/\&sa(.*)/,``)

const sendLinkFromGoogle = ( $, msg ) => ( i, a ) =>
  ( !i ) 
    ? bot.sendMessage( msg.chat.id, getURLFrom( a, $ ), { parse_mode: 'Markdown' } )
          .then( log( `${getURLFrom( a, $ )} delivered!` ) )
          .catch( log( `Error: ` ) )
    : false
const sendLink = ( msg ) => ( response ) => {
  const $ = cheerio.load( response.data )
  
  return $( `.r a` ).each( sendLinkFromGoogle( $, msg ) )
}
const sendGoogle = ( msg, match ) => 
  axios.get( `${URL_BASE}${match[ 1 ]}` )
      .then( sendLink( msg ) )
      .catch( log( `Error: `) )

bot.onText( /\/google (.*)/, sendGoogle )

//Enviando mensagem
bot.onText( /\/Foto/, (msg) => {
  bot.sendPhoto(msg.chat.id, URL_IMAGE)
});