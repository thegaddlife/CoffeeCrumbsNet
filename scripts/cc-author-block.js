$(function() {

    $(document).on("ready", function() {
        var ccAuthorBlock = $("#cc-author-block-wrapper");
        if (ccAuthorBlock.length && ccAuthorBlock.is(":visible"))
            ccAuthorBlock2.InitPlugin();
    });

});

var ccAuthorBlock2 = {

    GuestWriterId: "53f58994e4b0a4359f9f0e7b",

    InitPlugin: function() {

        this.LoadAuthor();
    },

    LoadAuthor: function() {

        // get author id
        var authorId = $("essay-author-link").data("author-id");;
        debugger;

        if (authorId === "" || authorId === this.GuestWriterId)
            return;

        $.ajax({
            url: "/the-team?author=" + authorId + "&format=json",
            type: "GET",
            async: false
        }).done(function(data) {
            SetAuthor(data);
        });

        // Call CC Summary block
        ccSummaryBlock2.ShowLoading = false;
        ccSummaryBlock2.DivWrapper.attr("data-cc-summary-query-type", "author");
        ccSummaryBlock2.DivWrapper.attr("data-cc-summary-query-value", "123424");
        ccSummaryBlock2.InitPlugin();
    },

    SetAuthor: function(data) {

    }

}