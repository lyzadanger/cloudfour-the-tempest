(function(c){var d;function a(){var e=[],f="glosses";this.supported=function(){return(typeof JSON!="undefined"&&typeof JSON.stringify!="undefined"&&typeof window.localStorage!="undefined")};this.save=function(g){if(!this.has(g)){e[e.length]=g;localStorage.setItem(f,JSON.stringify(e));return e}};this.has=function(h){for(var g=0;g<e.length;g++){if(e[g]==h){return true}}return false};this.all=function(){return e};this.clear=function(){e=[];localStorage.removeItem(f);return e};if(this.supported()){e=[];if(localStorage.getItem(f)){e=JSON.parse(localStorage.getItem(f))}}}var b={init:function(){var e;d=new a();b.update();e='<div id="glossHolder"><div class="glossTitle"><h3>Glossary</h3></div>';e+='<div class="glossContent"></div><div class="glossButtons">';e+='<div class="buttonBox"><button class="glossButton glossCloseButton">Close</button></div>';e+='<div class="buttonBox saveBox"><button class="glossButton glossSaveButton">Save</button></div></div></div>';c(e).css("display","none").appendTo("body");c(".glossButton").click(function(){c("#glossHolder").hide()});c(".glossary").find(".glossary-entry").each(function(){var g=c(this).attr("id"),f=c('[data-gloss ="'+g+'"]');f.addClass("gloss-item").toggleClass("gloss-item-saved",d.has(g));f.bind("click.show-gloss",b.show)});c("body").addClass("glossed")},show:function(){var e,j,f,i,h,g;g=c(this).gloss("viewport").width-30;g=(g>500)?500:g;f=c(this).data("gloss");e=c("#"+f).html();if(d.supported()&&!d.has(f)){c(".saveBox").addClass("active");c(".glossSaveButton").data("saveGloss",f).one("click.save-gloss",b.save)}else{c(".saveBox").removeClass("active")}j=c("#glossHolder");j.find(".glossContent").html(e);i=((c(window).height()-j.height())/2)+c(window).scrollTop()+"px";h=((c(window).width()-g)/2)+c(window).scrollLeft()+"px";j.css({left:h,top:i,width:g+"px"}).show()},save:function(){var e=c(this).data("saveGloss");d.save(e);c('span[data-gloss="'+e+'"]').addClass("gloss-item-saved");b.update()},clear:function(){d.clear();c(".gloss-item").removeClass("gloss-item-saved");c(".saved-glosses").fadeOut(500,function(){c(".saved-glosses").remove()})},update:function(){var e,g,f;e=d.all();if(!e.length){return}g=c("<dl></dl>").addClass("saved-glosses");for(var h=0;h<e.length;h++){glossId=e[h];$content=c("#"+glossId).html();$dtContent="";c('span[data-gloss="'+glossId+'"]').each(function(){$definition=c(this).clone();$definition.find("sup").remove();$dtContent+=$definition.html()});$dt=c("<dt></dt>").html($dtContent);$dd=c("<dd></dd>").attr("id","saved-"+glossId).html($content);g.append($dt).append($dd)}$remove=c("<dt></dt>").addClass("remove-glosses").html("Clear All");$remove.bind("click.gloss",b.clear);g.append($remove);if(!c("div.saved-glosses").length){f=c("<div></div>").addClass("saved-glosses").html("<h3>Saved Items</h3>");f.append(g).prependTo(c("body"));c("div.saved-glosses h3").click(function(){c("div.saved-glosses").toggleClass("open").find("dl").slideToggle("fast")})}else{c("div.saved-glosses dl").replaceWith(g);c("div.saved-glosses dl").toggle(c("div.saved-glosses").hasClass("open"))}},viewport:function(){return{width:window.innerWidth||(document.documentElement||document.body).clientWidth,height:window.innerHeight||(document.documentElement||document.body).clientHeight}}};c.fn.gloss=function(e){if(b[e]){return b[e].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof e==="object"||!e){return b.init.apply(this,arguments)}}}})(jQuery);$(document).ready(function(){$(".scene").gloss()});