//TODO: nest these helpers within one object, like arctic..

// global var whichs all public data, helpers etc..
window.arctic = {};
window.arctic.utils = {

    getCookie: function ( name ) {
        var cookieValue = null;

        if ( document.cookie && document.cookie !== '' ) {
            var cookies = document.cookie.split( ';' );

            for ( var i = 0; i < cookies.length; i++ ) {
                var cookie = jQuery.trim( cookies[i] );

                // Does this cookie string begin with the name we want?
                if ( cookie.substring( 0, name.length + 1 ) === ( name + '=' ) ) {
                    cookieValue = decodeURIComponent( cookie.substring( name.length + 1 ));
                    break;
                }
            }
        };

        return cookieValue;
    },

    growl: function ( type, title, text ) {
        var growl = '<div class="growl ' + type + '"> \
            <h6>' + title + '</h6> \
            <p>' + text + '</p> \
        </div>';

        var growl = $( growl );
        $( 'body' ).append( growl );

        return growl;
    },

    slugify: function ( text ) {
        text = text.toLowerCase();

        // remove accents, swap ñ for n, etc
        let from = 'àáäâèéëêìíïîòóöôùúüûñç';
        let to   = 'aaaaeeeeiiiioooouuuunc';
        for (let i=0, l=from.length ; i<l ; i++) {
            text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        return text
            .replace( /[^\w ]+/g, '' )
            .replace( / +/g, '-' );
    }
};
