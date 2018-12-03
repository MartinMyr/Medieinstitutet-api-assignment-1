$( document ).ready(function() {
    $(".delete").click(function() {
        $("#delete-input").val(this.getAttribute('data'));
    });

    $(".change").click(function() {
        $("#update-food").val(this.getAttribute('data-name'));
        $("#update-score").val(this.getAttribute('data-score'));
        $("#update-id").val(this.getAttribute('data-id'));
    });

});