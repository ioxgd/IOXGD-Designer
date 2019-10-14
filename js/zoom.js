
let zoom = 1;
let space_enter = false;

$(function() {
    let updateZoom = () => {
        if (zoom < 0.1) zoom = 0.1;
        if (zoom > 4) zoom = 4;
        $("#sketch").css("zoom", zoom);
        $("#zoom-size").val(`${Math.round(zoom * 100)}%`);
    }

    $("#zoom-in-btn").click(() => {
        zoom += 0.1;
        updateZoom();
    });

    $("#zoom-out-btn").click(() => {
        zoom -= 0.1;
        updateZoom();
    });

    $("#zoom-size").focus(() => {
        $("#zoom-size").val(Math.round(zoom * 100));
        $("#zoom-size").select();
    });

    $("#zoom-size").blur(() => {
        zoom = parseInt($("#zoom-size").val()) / 100;
        updateZoom();
    });

    $("#zoom-size").keypress(function(e){
        if(e.which == 13) {
            $(this).blur();    
        }
    });

    $("section.space").hover(() => {
        space_enter = true;
    }, () => {
        space_enter = false;
    })

    $(window).on('wheel', function(event){
        if (!space_enter) {
            return;
        }

        if(event.originalEvent.deltaY < 0){ // wheeled up
            $("#zoom-in-btn").click();
        } else { // wheeled down
            $("#zoom-out-btn").click();
        }
    });

    $(".space").on('wheel', function(e){
        e.preventDefault();
    });
});