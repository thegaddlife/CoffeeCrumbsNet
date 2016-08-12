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
        "50312c9fe4b00d577d15a857",
        "55e26f05e4b09e1859652657",
        "53efc1eae4b0b8045113b6d3",
        "542cc74fe4b07e808b11713e",
        "54965b9fe4b015fce7f500b0",
        "53efc217e4b0b8045113b707",
        "53efc22ce4b0a6d42412cf78",
        "53efc1b4e4b00e67f7f132fc",
        "563ee68ee4b07f78f2d7fd5b",
        "542cc758e4b07e808b11715e"
    ],

    SocialLinks: {
        FacebookUrl: "https://www.facebook.com/",
        InstagramUrl: "https://www.instagram.com/",
        TwitterUrl: "https://www.twitter.com/",
        PinterestUrl: "https://www.pinterest.com/"
    },

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

        if (author.customContent.facebookOn)
            $(".cc-team-member .cc-social-icon.facebook").attr("href", this.SocialLinks.FacebookUrl + author.customContent.facebookLink).addClass("cc-social-icon-true");
        if (author.customContent.instagramOn)
            $(".cc-team-member .cc-social-icon.instagram").attr("href", this.SocialLinks.InstagramUrl + author.customContent.instagramLink).addClass("cc-social-icon-true");
        if (author.customContent.twitterOn)
            $(".cc-team-member .cc-social-icon.twitter").attr("href", this.SocialLinks.TwitterUrl + author.customContent.twitterLink).addClass("cc-social-icon-true");
        if (author.customContent.pinterestOn)
            $(".cc-team-member .cc-social-icon.pinterest").attr("href", this.SocialLinks.PinterestUrl + author.customContent.pinterestLink).addClass("cc-social-icon-true");
        if (author.customContent.itunesOn)
            $(".cc-team-member .cc-social-icon.itunes").attr("href", author.customContent.itunesLink).addClass("cc-social-icon-true");
        if (author.customContent.rssOn)
            $(".cc-team-member .cc-social-icon.rss").attr("href", author.customContent.rssLink).addClass("cc-social-icon-true");

    },

    AfterLoad: function() {
        $("#cc-author-block-wrapper").fadeIn();
    }

}