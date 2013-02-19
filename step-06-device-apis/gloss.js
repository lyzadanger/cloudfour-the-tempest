(function($) {
  var storage;

  function GlossStorage() {
    var savedGlosses  = [],
        glossKey      = 'glosses';

    this.supported = function() {
      return (typeof JSON != 'undefined'
                && typeof JSON.stringify      != 'undefined' 
                && typeof window.localStorage != 'undefined');
    };
    this.save = function(gloss) {
      if (!this.has(gloss)) {
        savedGlosses[savedGlosses.length] = gloss;
        localStorage.setItem(glossKey, JSON.stringify(savedGlosses));
        return savedGlosses;
      }
    };
    this.has = function(gloss) {
      for (var i = 0; i < savedGlosses.length; i++) {
        if (savedGlosses[i] == gloss) {
          return true;
        }
      }
      return false;
    };
    this.all    = function() { return savedGlosses; };
    this.clear  = function() {
      savedGlosses = [];
      localStorage.removeItem(glossKey);
      return savedGlosses;
    }; 
    if (this.supported()) {
      savedGlosses = [];
      if (localStorage.getItem(glossKey)) {
        savedGlosses = JSON.parse(localStorage.getItem(glossKey));
      }
    }
  };

  var methods = {
    init: function() {
      var glossTemplate;

      storage = new GlossStorage();
      methods.update();
      glossTemplate = '<div id="glossHolder"><div class="glossTitle"><h3>Glossary</h3></div>';
      glossTemplate += '<div class="glossContent"></div><div class="glossButtons">';
      glossTemplate += '<div class="buttonBox"><button class="glossButton glossCloseButton">Close</button></div>';
      glossTemplate += '<div class="buttonBox saveBox"><button class="glossButton glossSaveButton">Save</button></div></div></div>';

      $(glossTemplate).css('display', 'none').appendTo('body');
      $('.glossButton').click(function() { $('#glossHolder').hide(); });
      $('.glossary').find('.glossary-entry').each(function() {
        var glossId     = $(this).attr('id'),
            $glossItems = $('[data-gloss ="' + glossId + '"]');
        $glossItems.addClass('gloss-item').toggleClass('gloss-item-saved', storage.has(glossId));
        $glossItems.bind('click.show-gloss', methods.show);
      });
    },
    show: function() {
      var $content, $popup, glossId, top, left, popupWidth;   
      popupWidth     = $(this).gloss('viewport').width - 30;
      popupWidth     = (popupWidth > 500) ? 500 : popupWidth;
      glossId        = $(this).data('gloss');
      $content       = $('#' + glossId).html();
      if (storage.supported() && !storage.has(glossId)) {
        $('.saveBox').addClass('active')
        $('.glossSaveButton').data('saveGloss', glossId).one('click.save-gloss', methods.save);
      } else {
        $('.saveBox').removeClass('active');
      }
      $popup         = $('#glossHolder');
      $popup.find('.glossContent').html($content);
      top    = (($(window).height() - $popup.height()) / 2) + $(window).scrollTop() + 'px';
      left   = (($(window).width() - popupWidth) / 2) + $(window).scrollLeft() + 'px';
      $popup.css( { left: left, top: top, width: popupWidth + 'px' }).show();
    },
    save: function() {
      var glossId = $(this).data('saveGloss');
      storage.save(glossId);
      $('span[data-gloss="' + glossId + '"]').addClass('gloss-item-saved');
      methods.update();
    },
    clear: function() {
      storage.clear();
      $('.gloss-item').removeClass('gloss-item-saved');
      $('.saved-glosses').fadeOut(500, function() { $('.saved-glosses').remove(); });
    },
    update: function() {
      var glosses, $list, $savedWrapper;
      glosses = storage.all();
      if (!glosses.length) { return; }
      // Build a <dl> of saved glosses
      $list        = $('<dl></dl>').addClass('saved-glosses');
      for(var i = 0; i < glosses.length; i++) {
        glossId    = glosses[i];
        $content   = $("#" + glossId).html();
        $dtContent = '';
        $('span[data-gloss="' + glossId + '"]').each(function() {
          $definition = $(this).clone();
          $definition.find('sup').remove();
          $dtContent += $definition.html();
        });
        $dt = $('<dt></dt>').html($dtContent);
        $dd = $('<dd></dd>').attr('id', 'saved-' + glossId).html($content);
        $list.append($dt).append($dd);
      }
      // Add a clear button
      $remove = $('<dt></dt>').addClass('remove-glosses').html('Clear All');
      $remove.bind('click.gloss', methods.clear);
      $list.append($remove);
      if (!$('div.saved-glosses').length) {
        $savedWrapper = $('<div></div>').addClass('saved-glosses').html('<h3>Saved Items</h3>');
        $savedWrapper.append($list).prependTo($('body'));
        $('div.saved-glosses h3').click(function() {
          $('div.saved-glosses').toggleClass('open').find('dl').slideToggle('fast');
        });
      } else {
        $('div.saved-glosses dl').replaceWith($list);
        $('div.saved-glosses dl').toggle($('div.saved-glosses').hasClass('open'));
      }
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