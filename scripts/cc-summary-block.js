$(function() {

    $(document).on("ready", function() {
        ccSummaryBlock.LoadSummaryItems();
    });

    $("#CCSummaryBlockLoadMoreLink").on("click", function() {
        ccSummaryBlock.LoadSummaryItems();
    });

})

ccSummaryBlock = {

    ImageCount: 9,

    LoadSummaryItems: function() {

        var showMore = $("#CCSummaryBlockLoadMoreLink");
        showMore.hide();

        // any posts left?
        if (!posts || posts.length === 0)
            return false;

        // TODO: custom ordering and sorting here
        // similar to the related posts algorithm

        var processed = 0;
        while (processed < this.ImageCount) {
            processed++;
            var post = posts[0]; // get first element
            this.AddSummaryItem(post);
            posts = posts.slice(1); // remove it
        }

        $(".summary-item").appendTo(".summary-item-list");
        //alert("Remaining: " + posts.length);

        // return indication of whether there are more posts to display
        if (posts.length > 0)
            showMore.fadeIn();
    },

    AddSummaryItem: function(post) {

        var summaryItem = $("#summary-item-clone").clone();
        summaryItem.removeAttr("id");

        // update summary title link full url
        // update summary title link inner text
        $(".summary-title-link", summaryItem)
            .first()
            .attr("href", post.fullUrl)
            .attr("title", post.title)
            .text(post.title);
    },

    LoadImage: function(post) {

        // parse out the img src
        var startIdx = post.body.indexOf("<noscript><img src=") + 20;
        var endIdx = post.body.indexOf("</noscript>", startIdx) - 5;
        var imgSrc = post.body.substring(startIdx, endIdx);

        var image = $("#ccSummaryBlock-image-" + postId);

        var downloadingImage = new Image();
        downloadingImage.onload = function() {
            image.src = this.src;
            // fade in
        };
        downloadingImage.src = imgSrc;

    }

}