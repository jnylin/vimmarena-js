/* 
	Katalogposten 
	
	youtube
	externalRes
	audioPlayer
	bokpuffen
	boktipset
	bokvideo
	ljudprov
	youtubeTrailer
	
*/
function CatalogueRecord(e, view) {

	var	selector, 
		pattYear = new RegExp("[0-9]{4}", "i"),
		methodsOnThisView,
		title, originalTitle, author, publisher, year, isbns, isbn, media, lang;
	
	// Sätt selector utifrån view och hämta specifika metoder
	this.view = view;
	
	switch (view) {
		case 'detail':
			selector = 'detail';
			methodsOnThisView = new DetailViewMethods(this);
			break;
		case 'list':
			selector = 'record';
			methodsOnThisView = new ListViewMethods(this);
			break;
	}
	
	console.log("methodOnThisView = ");
	console.log(methodsOnThisView);
	
	/* HTML-element */
	this.element = e;
	this.subElements = {
		title: $('.arena-'+selector+'-title span:not(.arena-result-item-number)', this.element),
		originalTitle: $('.arena-detail-original .arena-value', this.element),
		author: $('.arena-'+selector+'-author .arena-value', this.element),
		publisher: $('.arena-record-publisher .arena-value', this.element),		
		year: $('.arena-'+selector+'-year .arena-value', this.element),
		isbns: $('.arena-'+selector+'-isbn .arena-value', this.element),
		media: $('.arena-'+selector+'-media .arena-value', this.element),
		lang: $('.arena-'+selector+'-language .arena-value', this.element),
		cover: $('.arena-'+selector+'-cover', this.element),
		bookJacket: $('.arena-book-jacket', this.element) // länken och bilden ligger i .arena-book-jacket
	};

	/* Hämta rätt värden från elementen */
	title = this.subElements.title.text().trim();
	author = this.subElements.author.text();	
	publisher = this.subElements.publisher.text();
	year = this.subElements.year.text();
	media = this.subElements.media.text();
	lang = this.subElements.lang.text().trim();
	
    /*	ISBN är olika uppmärkt i träfflistan och katalogpostsidan
		.arena-value för record, .arena-value span för detail	*/
	switch (selector) {
		case "record":
			isbns = this.subElements.isbns.text().split(", ");
			break;
		case "detail":
			isbns = [];
			$(this.subElements.isbns).each(function() {
				isbns.push($(this).text().trim());
			});
			break;
	}
	
	if ( isbns ) {
		for ( var i = 0; i < isbns.length; i++ ) {
			var thisIsbn = isbns[i].replace(/-/g,"");
			if ( thisIsbn.length === 13 ) {
				isbn = thisIsbn;
				break;
			}
		}
	}

	/* Egenskaper för katalogposten */
	this.title = new Title(title, originalTitle);
	if ( author ) {
		this.author = {
			inverted: this.subElements.author.text(),
			lastname: this.subElements.author.text().split(',')[0].trim(),
			firstname: this.subElements.author.text().split(',')[1].substring(1).trim()
		};
	}
	if ( publisher ) {
		this.publisher = publisher;
	}
	if ( year ) {
		this.year = pattYear.exec(year);
	}
	if ( media ) {
		this.media = media;
	}	
	if ( lang ) {
		this.lang = lang;
	}	
	if ( isbn ) {
		this.isbn = isbn;
	}
	
	/* Egenskaper för mervärden */
	this.methodsOnThisView = methodsOnThisView;
	
	/* Priviligerade funktioner */
	this.getSelector = function() {
		return selector;
	};

	console.log(this);
}


/***********/
/* Metoder */
/***********/

// Modifiera visningen av katalogposten
CatalogueRecord.prototype.hideField = function(field) {
	$('.arena-'+this.getSelector()+'-'+field).hide();
};

CatalogueRecord.prototype.removeMediumFromTitle = function() {
	// Tar bort allmän medieterm från titel-elementet
	var obj = this.subElements.title;
	obj.text(((obj.text().replace(/\[.*\] ([\/:])/,'$1'))));
};

CatalogueRecord.prototype.truncateTitle = function() {
	var title = this.title.main;

	if ( this.title.part ) {
		title += ' ' + this.title.part;
	}

	this.subElements.title.html( truncate(title, 30) );
};

// Mervärden
CatalogueRecord.prototype.ljudprov = function() {
	new Ljudprov(this);
};

CatalogueRecord.prototype.smakprov = function() {
	new Smakprov(this);
};