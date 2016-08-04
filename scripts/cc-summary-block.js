$(function() {

    $(document).on("ready", function() {
        ccSummaryBlock.LoadImageBatch();
        $("#CCSummaryBlockLoadMoreLink").show();
    });

    $("#CCSummaryBlockLoadMoreLink").on("click", function() {
        $(this).hide();
        if (ccSummaryBlock.LoadImageBatch()) {
            $(this).fadeIn();
        }
    });

})

ccSummaryBlock = {

    ImageCount: 9,

    LoadImageBatch: function(count) {

        // any posts left?
        if (!posts || posts.length === 0)
            return false;

        for (var i = 0; i < posts.length; i++) {
            var post = posts[i];
            AddSummaryItem(post);
        }

        // loop over them and load their images

        // return indication of whether there are more posts to display
        return posts.length > 0;
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