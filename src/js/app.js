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

var data = { 
    publishedDate: "Sat, 27 Aug 2016", 
    image: "https://d262ilb51hltx0.cloudfront.net/max/2000/1*IxnfU6yMB4_gvtMdp0ZO0A.jpeg",
    title: "Bringing Remote Employees a Little Closer to Home",
    desc: "Fusce rhoncus accumsan ipsum vel facilisis. Mauris feugiat non diam ut semper. Curabitur eget posuere felis. Nam malesuada vitae lectus vitae malesuada. Fusce finibus neque vitae euismod dictum. Duis arcu leo, aliquet et arcu tincidunt, dictum blandit est. Pellentesque dictum nibh in molestie finibus. Maecenas elementum pretium lectus id vestibulum",
    link: "https://medium.com/@brandonjspencer/bringing-remote-employees-a-little-closer-to-home-e8985f5ab5a9?source=rss-4234ff1a9058------2"
}; 

$('#blog').append(template(data)); 

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


