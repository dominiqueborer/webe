//function submitRMComment(formToSubmit, rmCommentContainer, rmPageCounter, memeId) {

//    $.post("/api/memes/newcomment", $(formToSubmit).serialize()).done(function (data) {
//        //$.post("/api/memes/newcomment", $(formToSubmit).serialize()).done(function (data) {
//        //Check if POST request returned data and if it was successfully
//        try {
//            if (data.message.indexOf("successfully") !== -1) {
//                $.getJSON("/api/memes/getMemeComments/" + $(rmPageCounter).val() + "/" + $(memeId).val(), function (json) {

//                    json.memeComments.forEach(function (comment) {
//                        $(rmCommentContainer).children().remove();
//                        $(rmCommentContainer).add(comment);
//                    });
//                });
//            } else {
//                $(rmCommentContainer).add("<p>Error adding your comment, please try again.</p>");
//            }
//        } catch (err) {
//            $(rmCommentContainer).add("<p>Error adding your comment, please try again." + err.toString() + "</p>");

//        }
//    });
//    //$.post("/api/memes/newcomment", $(formToSubmit).serialize(), function (data) {
//    //    //Check if POST request returned data and if it was successfully
//    //    try {
//    //        if (data.message.indexOf("successfully") !== -1) {
//    //            $.getJSON("/api/memes/getMemeComments/" + $(rmPageCounter).val() + "/" + $(memeId).val(), function (json) {

//    //                json.memeComments.forEach(function (comment) {
//    //                    $(rmCommentContainer).children().remove();
//    //                    $(rmCommentContainer).add(comment);
//    //                });
//    //            });
//    //        } else {
//    //            $(rmCommentContainer).add("<p>Error adding your comment, please try again.</p>");
//    //        }
//    //    } catch(err){
//    //        $(rmCommentContainer).add("<p>Error adding your comment, please try again."+err.toString()+"</p>");

//    //    }
//    //});

//}

//Execute as soon as document is loaded fully
$(function () {
    // Attach a submit handler to the form
    $("#memeCommentForm").submit(function (event) {

        // Stop form from submitting normally
        event.preventDefault();

        // Get some values from elements on the page:
        var $form = $(this),
            memeIdStr = $form.find("input[name='memeId']").val(),
            commentStr = $form.find("textarea[name='comment']").val(),
            rmPageCounter = $form.find("input[name='rmPageCounter']").val();


        // Send the data using post
        $.post("/api/memes/newcomment", { memeId: memeIdStr, comment: commentStr })
            .done(function (data) {
            //$.post("/api/memes/newcomment", $(formToSubmit).serialize()).done(function (data) {
            //Check if POST request returned data and if it was successfully
            try {
                if (data.message.indexOf("successfully") !== -1) {
                    $("#rmCommentContainer").children().remove();
                    $.getJSON("/api/memes/getMemeComments/" + rmPageCounter + "/" + memeIdStr, function (json) {

                        json.memeComments.forEach(function (comment) {
                            var memeComment = "<div class='comment'>" +comment.Created + " "+ comment.LoginName;
                            memeComment += "<br>"+ comment.Comment +"</div>";
                            $("#rmCommentContainer").append(memeComment);


                        });
                    });
                } else {
                    $("#rmCommentContainer").prepend("<p>Error adding your comment, please try again.</p>");
                }
            } catch (err) {
                $("#rmCommentContainer").prepend("<p>Error adding your comment, please try again." + err.toString() + "</p>");

            }

            })
            .fail(function (data) {
                $("#rmCommentContainer").children().remove();
                $("#rmCommentContainer").prepend("<p>Error adding your comment, please try again." + data.toString() + "</p>");
            });
    });

});