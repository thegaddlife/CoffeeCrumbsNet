var CCBrowsePosts = {

    SetTitle: function() {

        var title = $("#page-body-header").find("h3");
        var titleText = title.text();

        title.text(titleText + "Some Category");
    }

}