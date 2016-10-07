window.jQuery = window.$ = require('jquery');
window._ = require('underscore');
require('foundation-sites')
require('motion-ui');
require('owl.carousel');

$(document).foundation();

// Navbar class add on scroll
$(window).scroll(function() {
	if ($(this).scrollTop() > 0) {
            $('nav').addClass('scrolled');
    } else {
        $('nav').removeClass('scrolled');
    }
});

//Case study tools carousel
$('.owl-carousel').owlCarousel({
    margin:50,
    stagePadding: 50,
    responsiveClass:true,
    nav: true,
    loop: true,
    rewind: false,
    dots: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:4,
            stagePadding: 80,
            margin: 80
        },
        1500:{
            items:5,
            stagePadding: 100,
            margin: 100
        }
    }
});

//Capture Medium post content
/*
var $posts;
function get_posts() {
  $.ajax('getpost.php').then(function(data) {$posts = $(data)});
}
*/
var publishedDate;

$.ajax({
  type: "GET",
  url: "getpost.php",
  dataType: "xml",
  success: function(xml) {
    // Parse the xml file and get data
    var xmlDoc = $.parseXML(xml);
        $xml = $(xmlDoc);
        $pubDate = $xml.find('pubDate');
        console.log($pubDate.text());
  }
});

//Display blog content in feed template on home page
var source = $("#medium-feed").html();
var template = Handlebars.compile(source);

$.ajax('getpost.php').then(function(data) {
	var $post = $(data).find('item');
	var $desc = $('<div>'+$post.children()[5].innerHTML+'</div>');
	var img = $desc.find('img').attr('src');
	console.log($desc.html());
	var data = {
	    publishedDate: $post.find('pubDate').text(),
	    image: img,
	    title: $post.find('title').text(),
	    desc: $desc.text().replace('<![CDATA[', '').replace(']]>', ''),
	    link: $post.find('link').text()
	};
	$('#blog').append(template(data));
});



//Smooth scroll function
function smooth_scroll(target, offset) {
  if (target.length) {
		var final_scroll = target.offset().top;
		if(offset) {
			final_scroll += offset;
		}
		console.log(final_scroll);
    $('html,body').animate({
      scrollTop: final_scroll
    }, 1000);
  }
}

// Smooth scroll js
$('a[href*="#"]:not([href="#"])').click(function() {
  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
      || location.hostname == this.hostname) {

      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			smooth_scroll(target);
  }
});
