$(function() {

    $(document).on("ready", function() {
        var ccAuthorBlock = $("#cc-author-block-wrapper");
        if (ccAuthorBlock.length && ccAuthorBlock.is(":visible"))
            ccAuthorBlock2.LoadAuthor();
    });

});

var ccAuthorBlock2 = {

    WriterIds: [
        "53efc207e4b0b8045113b6e5"
    ],

    LoadAuthor: function() {

        // get author id
        var authorId = $("#essay-author-link").data("author-id");;
        debugger;

        if (authorId === "" || this.WriterIds.includes(authorId) === false)
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
        ccSummaryBlock2.QueryType = "author";
        ccSummaryBlock2.QueryValue = authorId;
        //ccSummaryBlock2.LoadSummaryItems();
    },

    SetAuthor: function(data) {

    }

}