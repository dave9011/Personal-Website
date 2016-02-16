
'use strict';

var api_key = "";
var url_by_summ_name = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/JackBauer90,funsizes?api_key=" + api_key;

var anId = 43670727;
var res = null;

$( "#league_form" ).submit(function( event ) {
   event.preventDefault();
	
	$.ajax({
		url: '../site/php/lol_api_call.php',
		success: function(data) {
		 $('#response_wrapper').html(data);
		}
	});
	
	return;
  
	if( summ_name_in.value == ""){
		alert('Please enter a summoner name');
		return;
	}
  
  $.getJSON(url_by_summ_name, function( data ) {
		
		console.log(data);
		
		res = data;
		
	   var items = [];
		var names = [];
		var ids = []
	   $.each( data, function( key, val ) {
			names.push[val.name];
			ids.push[val.id];
			items.push( "<li id='" + key + "'> Summoner: " + val.name + " (" + val.id + ")</li>" );
		});

		responseData = data;
		
		$( "<ul/>", {
			"class": "my-new-list",
			html: items.join( "" )
		}).appendTo( "#response_wrapper" );
		
		$( "<p>" + JSON.stringify(data, null, "<br>") + "</p>" ).appendTo( "#response_wrapper" );
		
	});
});