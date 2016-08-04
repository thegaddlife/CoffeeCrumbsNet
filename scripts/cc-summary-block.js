$(function() {

    $(document).on("ready", function() {
        if (document.getElementById("summary-item-clone") !== null)
            ccSummaryBlock.LoadSummaryItems();
    });

    $("#CCSummaryBlockLoadMoreLink").on("click", function() {
        ccSummaryBlock.LoadSummaryItems();
        return false;
    });

});

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
            debugger;
            processed++;
            var post = posts[0]; // get first element
            this.AddSummaryItem(post, processed);
            posts = posts.slice(1); // remove it
        }

        //alert("Remaining: " + posts.length);

        // return indication of whether there are more posts to display
        if (posts.length > 0)
            showMore.fadeIn();
    },

    AddSummaryItem: function(post, num) {

        var summaryItem = $("#summary-item-clone").clone();
        summaryItem.attr("id", "summary-item-" + post.id);

        if (num % 3 === 0)
            summaryItem.css("margin-right", "0");
        else if (num === 1)
            summaryItem.addClass("sqs-active-slide");

        // update summary title link full url
        // update summary title link inner text
        $(".summary-title-link", summaryItem)
            .first()
            .attr("href", post.fullUrl)
            .attr("title", post.title)
            .text(post.title);

        var startIdx = post.body.indexOf("<noscript><img src=") + 20;
        var endIdx = post.body.indexOf("</noscript>", startIdx) - 5;
        var imgSrc = post.body.substring(startIdx, endIdx).replace('http:', 'https:');

        if (imgSrc && imgSrc.length) {
            $(".summary-thumbnail-image", summaryItem)
                .first()
                .attr("src", imgSrc + '?format=700w')
                .attr("href", post.fullUrl)
                .attr("data-src", imgSrc)
                .attr("data-image-dimensions", "800x535");
        }

        summaryItem.appendTo(".summary-item-list");
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