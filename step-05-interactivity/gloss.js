(function($) {
  var methods = {
    init: function() {
      var glossTemplate;
      glossTemplate = '<div id="glossHolder"><div class="glossTitle"><h3>Glossary</h3></div>';
      glossTemplate += '<div class="glossContent"></div><div class="glossButtons">';
      glossTemplate += '<div class="buttonBox"><button class="glossButton glossCloseButton">Close</button></div>';
      glossTemplate += '</div></div>';

      $(glossTemplate).css('display', 'none').appendTo('body');
      $('.glossButton').click(function() { $('#glossHolder').hide(); });
      $('.glossary').find('.glossary-entry').each(function() {
        var glossId     = $(this).attr('id'),
            $glossItems = $('[data-gloss ="' + glossId + '"]');
        $glossItems.addClass('gloss-item');
        $glossItems.click(function(event) { $(this).gloss('show'); });
      });
    },
    show: function() {
      var $content, $popup, top, left, popupWidth;   
      popupWidth     = $(this).gloss('viewport').width - 30;
      popupWidth     = (popupWidth > 500) ? 500 : popupWidth;
      $content       = $('#' + $(this).data('gloss')).html();
      $popup         = $('#glossHolder');
      $popup.find('.glossContent').html($content);
      top    = (($(window).height() - $popup.height()) / 2) + $(window).scrollTop() + 'px';
      left   = (($(window).width() - popupWidth) / 2) + $(window).scrollLeft() + 'px';
      $popup.css( { left: left, top: top, width: popupWidth + 'px' }).show();
    },
    viewport: function() {
      return { width: window.innerWidth || 
          (document.documentElement || document.body).clientWidth, 
         height: window.innerHeight || 
          (document.documentElement || document.body).clientHeight};
    }
  };
  $.fn.gloss = function(method) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    }  
  };
})( jQuery );

$(document).ready(function() {
  $('.scene').gloss();
});