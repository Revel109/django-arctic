/*
    Reveal.js extends foundation reveal()

    Required html attributes:
    data-open = is unique id for dialog
    data-url = is url which need to be opened with iframe
 */

( function ( $ ) {

    'use strict';

    function RevealIframe( element ) {
        this.element = element

        // setup dialog with iframe listener
        if ( this.element && this.element.size() ) {
            this.url = this.element.data( 'url' )
            this.id = this.element.data( 'open' )
            this.size = this.element.data( 'size' )
            this.dialog = $( '#' + this.id )
            this.iframe = this.dialog.find( 'iframe' )
        }

        // it's an iframe
        if ( window.parent != window ) {
            this.framed = true;
            this.body = $( 'body' )
            this.id = this.body.data( 'id' )
            this.hide = $( '[data-close]' )
            this.auto_close = this.body.data( 'auto-close' )
            this.parent_reload = this.body.data( 'refresh-parent' )
        }

        self = this
        this.init()
    }


    RevealIframe.prototype.init = function ( ) {

        // open dialog with an iframe
        if ( this.url && this.dialog && this.element.size() ) {

            if ( this.size ) {
                this.dialog.addClass( this.size )
            }

            this.element.on( 'click', this.open )
        }

        // if in iframe listen to close dialog
        if ( this.framed ) {

            if ( this.parent_reload ) {
                console.log( 'reload parent..');
                window.parent.location.reload();
            }

            if ( this.auto_close ) {
                this.close( this.id )
            }

            this.hide.on( 'click' , function ( ) {
                self.close( this.id )
            })
        }
    }


    RevealIframe.prototype.open = function () {
        // setup iframe

        self.dialog.on( 'open.zf.reveal', function ( ) {
            self.iframe.attr( 'src', self.url )

            self.iframe.on( 'load' , function( ) {
                this.style.height = this.contentDocument.body.scrollHeight +'px';
            })
        })
    }


    RevealIframe.prototype.close = function ( id ) {

        if ( id ) {
            // if there's a ID only close this dialog in parent window
            this.dialog = window.parent.$( window.parent.document).find( '#' + id )
        } else {
            // close all dialogs in parent window
            this.dialog = window.parent.$( window.parent.document).find( '.reveal' )
        }

        // close all reveal dialogs within parent window
        this.dialog.trigger('closeme.zf.reveal');

        // remove src on iframe
        this.iframe = this.dialog.find('iframe')
        this.iframe.removeAttr( 'src' );
    }

    // initiate
    new RevealIframe( $( '[data-open][data-url]' ) )

})( jQuery );