(function() {

    debugger;
    if ($("#BrowsePostsHeading").length) {
        CCBrowsePosts.SetTitle();
    }

});


var CCBrowsePosts = {

    SetTitle: function() {

        var queryParam = "Perspective";
        $("#BrowsePostsHeading")
            .text("Browse Essays - " + queryParam)
            .fadeIn();

    },

    LoadSummaryItems: function() {

    }

}