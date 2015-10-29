$(function() {
Parse.initialize('XPDFuwbKoqTqdB9G5daVNePewDiVViSKiL7d0pk9', 'ZUkDXUUO7W6j5fOZpqHgfst6WHOG8thgnO66EmoW');


var Crud = Parse.Object.extend('Crud');

$('#rater').raty({path:'raty-2.7.0/lib/images'});


$('form').submit(function() {	
	var crud = new Crud();	
	var score = $("#rater").raty('score')
	$('#topic').upvote();
	crud.set("title", $('#title').val());
	crud.set("review", $('#review').val());
	crud.set("rater", score);
	crud.set("voting", 0);
	crud.save();
	})


var getData = function() {	
	var query = new Parse.Query(Crud);
	query.find({
		success: function(results) {
			buildList(results);
	}
	})
}

var buildList = function(data) {
	$('ol').empty()
	var countStar = 0;
	var countReview = 0;
	data.forEach(function(d){
		addItem(d);
		countReview++;
		if (d.get('rater') != undefined){
		countStar += d.get('rater');
		}
	})
	var average = countStar / countReview;
	$('#avgStar').raty({readOnly: true, score: average, path: 'raty-2.7.0/lib/images'});
}

var addItem = function(item) {
	
	var title = item.get('title')
	var review = item.get('review')	
	var rater = item.get('rater')
	var voting = item.get('voting')
	var li = $('<li></li>')	
	var thumbsUp = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-thumbs-up"></span></button>');
	var thumbsDown = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-thumbs-down"></span></button>');
	var div = $('<div class = well well-sm><h3>' + title + '</h3><br>' + review + '</div>');
	var divRater = $("<div id = 'divRater'></div>");
	var divStars = divRater.raty({readOnly: true, score:rater});
	var totalVotes = 0;
	var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
	$('ol').append(li);
	li.append(div);
	li.prepend(button);
	div.prepend(divStars);
	div.append(thumbsUp);
	div.append(thumbsDown);
	div.append(voting);
	div.append(" " + thumbsUp.val() + " found this useful");
	thumbsUp.click(function(){
		item.increment("voting");
		item.save();
	});
	thumbsDown.click(function(){
		item.increment("voting", -1);
		item.save();
	});
	button.click(function() {
		item.destroy({
			success:getData
		})
	})
}
getData();
});
