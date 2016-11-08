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
var source = $("#medium-feed").html();
var template = Handlebars.compile(source);

$.ajax('getpost.php').then(function(data) {
	var $post = $(data).find('item').first();
	var $pub = $post.find('pubDate').first().text();
	var $desc = $('<div>'+$post.children()[5].innerHTML+'</div>');
	var img = $desc.find('img').first().attr('src');
	var desc = $desc.text().replace('<![CDATA[', '').replace(']]>', '');
	var desc_split = desc.split(' ');
	var pub_split = $pub.split(' ');
	desc = desc_split.slice(0, 75).join(' ');
	publishedDate = pub_split.slice(0, 4).join(' ');
	
	console.log($desc.html());
	var data = {
    publishedDate: publishedDate,
    image: img,
    title: $post.find('title').first().text(),
    desc: desc,
    link: $post.find('link').first().text()
	};
	//Display blog content in feed template on home page
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
