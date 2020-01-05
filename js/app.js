 
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

  element.off();
    
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
      let moveX = event.pageX - startX;
      let moveY = event.pageY - startY;

      moveX = Math.round(moveX / 10) * 10;
      moveY = Math.round(moveY / 10) * 10;

      $(".input-x-offset").val(Math.round(moveX)).change();
      $(".input-y-offset").val(Math.round(moveY)).change();
    }).bind('mouseup', function(event, ui){
      $(this).unbind('mousemove');
      $(this).unbind('mouseup');
    });
  });

  element.bind('mouseup', function(event, ui){
    $(this).unbind('mousemove');
    $(this).unbind('mouseup');
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

let show_grid = false;
let grid_size = 100;

let updateSketchBackground = () => {
  let canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 480;
  let ctx = canvas.getContext("2d");

  let gradient = ctx.createLinearGradient(0, 0, 0, 480);
  gradient.addColorStop(0, pageAndComponent[pageFocus].background.main_color);
  gradient.addColorStop(1, pageAndComponent[pageFocus].background.grad_color);
  ctx.fillStyle = gradient;

  ctx.fillRect(0, 0, 800, 480);

  if (show_grid) {
    for (let x=grid_size;x<800;x+=grid_size) {
      ctx.beginPath();
      ctx.setLineDash([ 10, 10 ]);
      ctx.moveTo(x, 5);
      ctx.lineTo(x, 480);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    for (let y=grid_size;y<480;y+=grid_size) {
      ctx.beginPath();
      ctx.setLineDash([ 10, 10 ]);
      ctx.moveTo(5, y);
      ctx.lineTo(800, y);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  svgSketch.style.background = `url(${canvas.toDataURL()})`;
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

    $(".property").off();
    $(".property").change(async function(e) {
      let propertyName = e.target.getAttribute("data-property");
      pageAndComponent[pageFocus].background[propertyName] = e.target.value;

      /*
      $("#sketch").css({
        background: `linear-gradient(180deg, ${pageAndComponent[pageFocus].background.main_color} 0%, ${pageAndComponent[pageFocus].background.grad_color} 100%)`,
      });
      */
      updateSketchBackground();
    });
  });

  let ctrlDown = false;

  $(document).keydown((e) => {
    if (e.keyCode === 17 || e.keyCode === 91) ctrlDown = true;
  }).keyup((e) => {
    if (e.keyCode === 17 || e.keyCode === 91) ctrlDown = false;
  });

  let copyID = "";

  let duplicateComponent = async (sourceID) => {
    if (!sourceID) sourceID = $(".focus").attr("data-id");

    let sourceComponent = pageAndComponent[pageFocus].component[sourceID];

    if (!sourceComponent) {
      return;
    }
    
    let comp = abstractComponentList.find(e => e.name === sourceComponent.name);

    if (typeof comp === "undefined") {
      alert("Error!, not found " + name);
      return;
    }
    
    let newID = `component-${componentCount++}`;
    
    pageAndComponent[pageFocus].component[newID] = JSON.parse(JSON.stringify(sourceComponent));
    pageAndComponent[pageFocus].component[newID].property.name = comp.property.name.default();
    pageAndComponent[pageFocus].component[newID].property.x += 10;
    pageAndComponent[pageFocus].component[newID].property.y += 10;
    
    let element = comp.render.create();
    element.setAttribute("data-id", newID);
    element.setAttribute("class", "component");

    svgSketch.appendChild(element);

    comp.render.update.bind(pageAndComponent[pageFocus].component[newID])(element);
    
    reconfigDraggable();

    $(`.component[data-id='${newID}']`).click().mousedown().mouseup();

    copyID = newID;
  };

  $(document).keydown((e) => {
    if (ctrlDown && e.keyCode === 68) { // Ctrl+D (D is 68)
      duplicateComponent();
    } else if (ctrlDown && e.keyCode === 67) { // Ctrl+C (C is 67)
      copyID = $(".focus").attr("data-id");
    } else if (ctrlDown && e.keyCode === 86) { // Ctrl+V (C is 86)
      if (copyID !== "") {
        duplicateComponent(copyID);
      }
    }
  });

  grid_size = 100;
  updateSketchBackground();

  $("#sketch").click();
});