function fontManagerOpen() {
    $("div.font-model .tabs > li[data-content='manage']").click();

    $(".all-model > div.font-model").show();
}

function fontAddOpen() {
    $("div.font-model .tabs > li[data-content='add']").click();
    
    $(".all-model > div.font-model").show();
}

$(function() {
    $(".model-close-btn").click(function() {
        $(".all-model > div").hide();
    })
});