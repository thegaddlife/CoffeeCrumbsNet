$(document).on("ready", function() {

    if ($("#BrowsePostsHeading").length) {
        CCBrowsePosts.SetTitle();
    }

});


var CCBrowsePosts = {

    SetTitle: function() {

        var queryParam = this.GetQueryVal("category");
        $("#BrowsePostsHeading")
            .text("Browse Essays - " + queryParam)
            .fadeIn();

    },

    LoadSummaryItems: function() {

    },

    GetQueryVal: function(key) {
        key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
        var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    }

}