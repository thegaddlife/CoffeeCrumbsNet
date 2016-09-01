$(function() {

    $(document).on("ready", function() {
        var ccAuthorBlock = $("#cc-author-block-wrapper");
        if (ccAuthorBlock.length)
            ccAuthorBlock2.LoadAuthors();
    });

});

var ccAuthorBlock2 = {

    WriterIds: [
        "50312c9fe4b00d577d15a857",
        "53efc1b4e4b00e67f7f132fc",
        "53efc1eae4b0b8045113b6d3",
        "53efc207e4b0b8045113b6e5",
        "53efc217e4b0b8045113b707",
        "53efc22ce4b0a6d42412cf78",
        "542cc74fe4b07e808b11713e",
        "542cc758e4b07e808b11715e",
        "54965b9fe4b015fce7f500b0",
        "55e26f05e4b09e1859652657",
        "551c610ce4b0f86de559f9f5",
        "563ee68ee4b07f78f2d7fd5b",
        "57c35d3615d5db588da4a20c",
        "57c363a4f5e231b32aacca32",
        "5568e194e4b012775fff2947"
    ],

    SocialLinks: {
        FacebookUrl: "https://www.facebook.com/",
        InstagramUrl: "https://www.instagram.com/",
        TwitterUrl: "https://www.twitter.com/",
        PinterestUrl: "https://www.pinterest.com/"
    },

    LoadAuthors: function() {

        debugger;
        var that = this;

        $("article").each(function() {

            debugger;
            // get author id
            var authorId = $("#essay-author-link", this).data("author-id");;

            if (authorId === "" || that.WriterIds.includes(authorId) === false)
                return;

            $.ajax({
                url: "/the-team?author=" + authorId + "&format=json",
                type: "GET",
                async: false
            }).done($.proxy(function(data) {
                if (data.items && data.items.length === 1)
                    that.SetAuthor(data.items[0], this);
            }, this));

            // Call CC Summary block
            var ccAuthorSummaryBlock = $("#CCSummaryBlock", this);
            if (ccAuthorSummaryBlock.length) {
                ccSummaryBlock2.ShowLoading = false;
                ccSummaryBlock2.ImagesPerBatch = 3;
                ccSummaryBlock2.QueryType = "author";
                ccSummaryBlock2.QueryVal = authorId;
                ccSummaryBlock2.LoadSummaryItems();

                $("#cc-author-block-wrapper, #cc-author-related", this).fadeIn();
            } else {
                $("#cc-author-block-wrapper", this).fadeIn();
            }

        });

    },

    SetAuthor: function(author, article) {

        // image
        $("#cc-author-image-link", article).attr("href", author.fullUrl);

        var $img = $("#cc-author-image", article);
        var imgUrl = author.assetUrl;
        $img
            .data("src", imgUrl)
            .data("image", imgUrl)
            .attr("src", imgUrl + "?format=300w");

        // excerpt
        $("#cc-author-excerpt", article).html(author.excerpt.replace(/'/g, "'"));

        // more from ...
        $("#cc-author-more-from", article).text("More from " + author.author.firstName);

        // social links
        // remove jsont errors
        $(".cc-team-member .cc-social-icon", article)
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.facebookOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.instagramOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.twitterOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.pinterestOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.itunesOn'.]")
            .removeClass("cc-social-icon-[JSONT: Can't resolve 'customContent.rssOn'.]");

        if (author.customContent.facebookOn)
            $(".cc-team-member .cc-social-icon.facebook", article).attr("href", this.SocialLinks.FacebookUrl + author.customContent.facebookLink).addClass("cc-social-icon-true");
        if (author.customContent.instagramOn)
            $(".cc-team-member .cc-social-icon.instagram", article).attr("href", this.SocialLinks.InstagramUrl + author.customContent.instagramLink).addClass("cc-social-icon-true");
        if (author.customContent.twitterOn)
            $(".cc-team-member .cc-social-icon.twitter", article).attr("href", this.SocialLinks.TwitterUrl + author.customContent.twitterLink).addClass("cc-social-icon-true");
        if (author.customContent.pinterestOn)
            $(".cc-team-member .cc-social-icon.pinterest", article).attr("href", this.SocialLinks.PinterestUrl + author.customContent.pinterestLink).addClass("cc-social-icon-true");
        if (author.customContent.itunesOn)
            $(".cc-team-member .cc-social-icon.itunes", article).attr("href", author.customContent.itunesLink).addClass("cc-social-icon-true");
        if (author.customContent.rssOn)
            $(".cc-team-member .cc-social-icon.rss", article).attr("href", author.customContent.rssLink).addClass("cc-social-icon-true");

    }

}