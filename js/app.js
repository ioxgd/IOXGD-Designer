 
function updateComponentFrame() {
  let n = $(".focus").length;
  if (n >= 1) {
    let x=0, y=0, width=0, height=0;
    let focus = $(".focus")[0];
    // let offset = $("#sketch").offset();
    let id = focus.getAttribute("data-id");
    let name = pageAndComponent[pageFocus].component[id].name;
    
    let comp;
      
    // Find component name in list
    abstractComponentList.forEach(function(element) {
      if (element.name === name) {
        comp = element;
      }
    });
    if (typeof comp === "undefined") {
      alert("Error!, not found " + name);
      return;
    }

    let move = comp.render.frame.bind(pageAndComponent[pageFocus].component[id])();
    if (move.length == 4) {
      x = move[0];
      y = move[1];
      width = move[2];
      height = move[3];
    } else if (move.length == 2) {
      x = move[0];
      y = move[1];
      width = focus.offsetWidth;
      height = focus.offsetHeight;
    } else {
      x = focus.offsetLeft;
      y = focus.offsetTop;
      width = focus.offsetWidth;
      height = focus.offsetHeight;
    }

    // Top
    $("#component-frame1").css({ left: x - 1, top: y - 1, width: width + 2 });

    // Right
    $("#component-frame2").css({ left: x + width, top: y - 1, height: height + 2 });

    // Bottom
    $("#component-frame3").css({ left: x - 1, top: y + height, width: width + 2 });

    // Left
    $("#component-frame4").css({ left: x - 1, top: y - 1, height: height + 2 });

    $("#component-frame1, #component-frame2, #component-frame3, #component-frame4").show();
  } else {
    $("#component-frame1, #component-frame2, #component-frame3, #component-frame4").hide();
  }
}

var startX = 0, startY = 0;
function reconfigDraggable() {
  let element = $("#sketch > .component");
    
  element.bind('mousedown', function(event, ui){
    // bring target to front
    $(".focus").removeClass("focus");
    // $(event.target.parentElement).append(event.target)
    // console.log(event.target.classList.contains("component"));
    if (event.target.classList.contains("component")) {
      $(event.target).addClass("focus");
    } else {
      $(event.target).parents(".component").addClass("focus");
    }
      
    updateComponentFrame();
    updatePropertyTable();

    startX = event.pageX - $(".input-x-offset").val();
    startY = event.pageY - $(".input-y-offset").val();

    $("#sketch").bind('mousemove', function(event, ui){
      let x = event.pageX;
      let y = event.pageY;
      let moveX = x - startX;
      let moveY = y - startY;

      moveX = moveX * zoom;
      moveY = moveY * zoom;

      moveX = Math.round(moveX / 10) * 10;
      moveY = Math.round(moveY / 10) * 10;

      $(".input-x-offset").val(Math.round(moveX)).change();
      $(".input-y-offset").val(Math.round(moveY)).change();
    });
  });

  element.bind('mouseup', function(event, ui){
    $("#sketch").unbind('mousemove');
  });
}

function savePageAndProject() {
  let pagePath = path.resolve(project.path + "/" + project.name);
    
  if (!fs.existsSync(pagePath)) {
    try {
      fs.mkdirSync(pagePath);
    } catch(err) {
      alert("Can't create project directory, Plz close File Explorer");
      return;
    }
  }
    
  let projectFile = pagePath + "/" + project.name + ".kd";
  let projectFileContent = JSON.stringify({
    pages: project.pages
  });
  try {
    fs.writeFileSync(projectFile, projectFileContent); // Write page file
  } catch(err) {
    alert("Can't write project file, Your disk is full ?");
    return;
  }
    
  let contentFile = componentToJson();
    
  try {
    fs.writeFileSync(pagePath + "/" + project.activePageName + ".json", contentFile); // Write page file
  } catch(err) {
    alert("Can't write page file, Your disk is full ?");
    return;
  }
}

function removeAllComponent() {
  $(svgSketch).find(".component").remove();
  componentList = {};
}
  
function updatePageListAndActive() {
  let html = "";
  for (var i=0;i<project.pages.length;i++) {
    html += "<li" + (project.activePageName === project.pages[i] ? " class=\"active\"" : "") + ">";
    html += project.pages[i];
    html += "</li>";
  }
  $("#page-list").html(html);
  
  $("#page-list > li").click(function() {
    if ($(this).text() === project.activePageName) {
      return;
    }
    if (project.activePageName !== null) savePageAndProject(); // Save old page
    removeAllComponent();
    
    project.activePageName = $(this).text();
    $("#page-list > li").removeClass("active");
    $(this).addClass("active");
    
    let filePath = path.resolve(project.path + "/" + project.name + "/" + project.activePageName + ".json");
    
    let contentFile;
    try {
      contentFile = fs.readFileSync(filePath);
    } catch(err) {
      console.log("Can't open file " + project.activePageName + ".json !");
      return;
    }
          
    loadComponentFromJson(contentFile);
  });
}

$(function() {
  
  // Hot key
  document.onkeydown = function(e) {
    if (e.which === 46) { // Delete
      let focus = $(".focus");
      let id = focus.attr("data-id");
      focus.remove();
      delete pageAndComponent[pageFocus].component[id];
      
      // Hide frame
      updateComponentFrame();
      
      $("#property-box").html("");
    } else if (e.which === 38) { // Up
      $(".input-y-offset").val(parseInt($(".input-y-offset").val()) - 10).change();
    } else if (e.which === 40) { // Down
      $(".input-y-offset").val(parseInt($(".input-y-offset").val()) + 10).change();
    } else if (e.which === 37) { // Left
      $(".input-x-offset").val(parseInt($(".input-x-offset").val()) - 10).change();
    } else if (e.which === 39) { // Right
      $(".input-x-offset").val(parseInt($(".input-x-offset").val()) + 10).change();
    }
  };
  
  // Update component list
  var html = "";
  let comps = getAbstractComponent();
  comps.forEach(function(element) {
    html += `<li data-name="${element.name}">`;
    html += `<span class="icon">${element.icon}</span>`;
    html += `<span class="label">${element.name}</span>`;
    html += '</li>';
  });
  $("#object-list").html(html);
  
  $("#object-list > li").click(function(e) {
    createComponent($(this).attr("data-name"));
  });
  
  // No focus
  $("#sketch").on('click', function(e) {
    if (e.target !== this)
      return;
    
    // console.log('clicked');
    $(".focus").removeClass("focus");
    
    updateComponentFrame();
    
    let code = "";
    code += `<li>`;
    code += `<div class="label">Main color</div>`;
    code += `<div class="value"><input type="text" class="input-color property" data-property="main_color" value="${pageAndComponent[pageFocus].background.main_color}"></div>`;
    code += `</li>`;
    code += `<li>`;
    code += `<div class="label">Gradient color</div>`;
    code += `<div class="value"><input type="text" class="input-color property" data-property="grad_color" value="${pageAndComponent[pageFocus].background.grad_color}"></div>`;
    code += `</li>`;
    $("#property-box").html(code);

    $(".input-color").each(function() {
      // console.log(this);
      let a = new jscolor(this, { hash:true });
    });

    $(".property").change(async function(e) {
      let propertyName = e.target.getAttribute("data-property");
      pageAndComponent[pageFocus].background[propertyName] = e.target.value;

      $("#sketch").css({
        background: `linear-gradient(180deg, ${pageAndComponent[pageFocus].background.main_color} 0%, ${pageAndComponent[pageFocus].background.grad_color} 100%)`,
      });
    });
  });

  $("#sketch").click();
});