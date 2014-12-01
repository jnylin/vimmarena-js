(function($) {
  $.ajax({
    type: 'GET',
    url: "http://bibliotek.vimmerby.se/documents/58068/138011/arenajs.min.js/ce0740d4-a718-4217-aa67-55035d95f6eb",
    datatype: 'script',
    cache: true,
    success: function() {
		var cssClass = 'portlet-listRecordSearchResult',
			settings = {
				hideFields: ['media', 'year']
			};
		
		new SearchResult($('.'+cssClass), settings);
		Wicket.Ajax.registerPostCallHandler(function() {
			new SearchResult($('.'+cssClass), settings);
		});

    }
  });
}(jQuery));