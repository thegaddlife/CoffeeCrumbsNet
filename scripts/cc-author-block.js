$(function() {

    $(document).on("ready", function() {
        var ccAuthorBlock = $("#cc-author-block-wrapper");
        if (ccAuthorBlock.length)
            ccAuthorBlock2.LoadAuthor();
    });

});

var ccAuthorBlock2 = {

    WriterIds: [
        "53efc207e4b0b8045113b6e5",
        "50312c9fe4b00d577d15a857"
    ],

    LoadAuthor: function() {

        // get author id
        var authorId = $("#essay-author-link").data("author-id");;

        if (authorId === "" || this.WriterIds.includes(authorId) === false)
            return;

        var that = this;

        $.ajax({
            url: "/the-team?author=" + authorId + "&format=json",
            type: "GET",
            async: false
        }).done(function(data) {
            if (data.items.length === 1)
                that.SetAuthor(data.items[0]);
        });

        // Call CC Summary block
        ccSummaryBlock2.ShowLoading = false;
        ccSummaryBlock2.ImagesPerBatch = 3;
        ccSummaryBlock2.QueryType = "author";
        ccSummaryBlock2.QueryVal = authorId;
        ccSummaryBlock2.LoadSummaryItems(this.AfterLoad);
    },

    SetAuthor: function(author) {

        // image
        $("#cc-author-image-link").attr("href", author.fullUrl);

        var $img = $("#cc-author-image");
        var imgUrl = author.assetUrl;
        $img
            .data("src", imgUrl)
            .data("image", imgUrl)
            .attr("src", imgUrl + "?format=300w");

        // excerpt
        $("#cc-author-excerpt").html(author.excerpt);

        // more from ...
        $("#cc-author-more-from").text("More from " + author.author.firstName);

        // social links
        // remove jsont errors
        $(".cc-team-member .cc-social-icon")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.facebookOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.instagramOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.twitterOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.pinterestOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.itunesOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.rssOn'.]");

        if (author.customContent.facebookOn) {
            $(".cc-team-member .cc-social-icon.facebook")
                .attr("href", author.customContent.facebookUrl)
                .addClass("cc-social-icon-true");
        }
    },

    AfterLoad: function() {
        $("#cc-author-block-wrapper").fadeIn();
    }

}