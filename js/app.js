// const remote = require('electron').remote;
// const { shell } = require('electron');
// const dialog = remote.dialog;
// const app = remote.app;

// console.log(app);

// const util = require('util');
// const exec = util.promisify(require('child_process').exec);

// const fs = require('fs');
// const rimraf = require('rimraf');

// const path = require("path");

/* 
var grid_size = 20;
var project = {
  name: "New-project",
  path: path.resolve(app.getPath("documents") + "/KidDesigner"),
  pages: ["Hello"],
  activePageName: "Hello"
};

if (!fs.existsSync(project.path)) {
  try {
    fs.mkdirSync(project.path);
  } catch(err) {
    alert("Can't create KidDesigner in My Documents directory, Plz close File Explorer");
  }
} */

function selectFolder() {
  return dialog.showOpenDialog({ properties: ['openDirectory'] });
}
  
function selectFile(callback) {
  /*
  let inp = document.createElement("input");
  inp.setAttribute("type", "file");
  inp.setAttribute("accept", ".gd");
  console.log(inp);
  $(inp).change(function(e) {
    if (typeof callback === "function") callback($(this).val());
  }).click();
  */
  if (typeof callback === "function") callback(dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: "GD", extensions: ["gd"] }] }));
}
  
function updateComponentFrame() {
  let n = $(".focus").length;
  if (n >= 1) {
    let x=0, y=0, width=0, height=0;
    let focus = $(".focus")[0];
    // let offset = $("#sketch").offset();
    let id = focus.getAttribute("data-id");
    let name = componentList[id].name;
    
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

    let move = comp.render.frame.bind(componentList[id])();
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
    
    /*
    if (focus.tagName !== "circle") {
      x = +focus.getAttribute('x');
      y = +focus.getAttribute('y');
      width = +focus.getAttribute('width');
      height = +focus.getAttribute('height');
    } else {
      r = +focus.getAttribute('r');
      x = +focus.getAttribute('cx') - r;
      y = +focus.getAttribute('cy') - r;
      width = r * 2;
      height = r * 2;
    }
    */
    /* $("#component-frame").attr("x", x);
    $("#component-frame").attr("y", y);
    $("#component-frame").attr("width", width);
    $("#component-frame").attr("height", height); */
      
    // $("#sketch").append($("#component-frame"));

    /*
    // Top
    $("#component-frame1").attr("x1", x);
    $("#component-frame1").attr("y1", y);
    $("#component-frame1").attr("x2", x + width);
    $("#component-frame1").attr("y2", y);

    // Right
    $("#component-frame2").attr("x1", x + width);
    $("#component-frame2").attr("y1", y);
    $("#component-frame2").attr("x2", x + width);
    $("#component-frame2").attr("y2", y + height);

    // Bottom
    $("#component-frame3").attr("x1", x);
    $("#component-frame3").attr("y1", y + height);
    $("#component-frame3").attr("x2", x + width);
    $("#component-frame3").attr("y2", y + height);

    // Left
    $("#component-frame4").attr("x1", x);
    $("#component-frame4").attr("y1", y);
    $("#component-frame4").attr("x2", x);
    $("#component-frame4").attr("y2", y + height);
    */

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
    /* $("#component-frame").attr("width", "0");
    $("#component-frame").attr("height", "0"); */

    $("#component-frame1, #component-frame2, #component-frame3, #component-frame4").hide();
  }
}
  
function reconfigDraggable() {
  let element = $("#sketch > .component");
    
  // try {
  //   element.draggable("destroy").off();
  // } catch(e) {
      
  // }
  
  // console.log(element);
    
  element
  // .draggable({
  //   start: function(event, ui) {
  //     event.target.style.opacity = 0.5;
  //   },
  //   drag: function(event, ui) {
  //     let offset = $("#sketch").offset();
  //     let x = ui.position.left - offset.left;
  //     let y = ui.position.top - offset.top;
  //     let id = event.target.getAttribute("data-id");
  //     updateComponentPosition(id, x, y);
        

  //     /*
  //     if (event.target.tagName !== "circle") {
  //       event.target.setAttribute('x', ui.position.left - offset.left);
  //       event.target.setAttribute('y', ui.position.top - offset.top);
  //     } else {
  //       let r = +event.target.getAttribute('r');
  //       event.target.setAttribute('cx', ui.position.left - offset.left + r);
  //       event.target.setAttribute('cy', ui.position.top - offset.top + r);
  //     }
  //     */

  //     updateComponentFrame();
  //     updatePropertyTable();
  //   },
  //   stop: function(event, ui) {
  //     event.target.style.opacity = 1;
  //   },
  //   containment: "#sketch",
  //   scroll: false,
  //   grid: $("#snap-to-grid").attr("data-check") === "1" ? [ grid_size, grid_size ] : false,
  // })
  .bind('mousedown', function(event, ui){
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
  // reconfigDraggable();
  
  /*
  $("#top-menu .option").click(function() {
    // 
  });
  
  $("#snap-to-grid").click(function() {
    $(this).attr("data-check", $(this).attr("data-check") === "1" ? "0" : "1");
    
    reconfigDraggable();
  });
  */
  
  
  // $("#grid-size").click(function() {
  //   $.confirm({
  //     title: 'Grid Size',
  //     content: '' +
  //     '<form action="" class="formInDialog" autocomplete="off">' +
  //     '<div class="form-group">' +
  //     '<label>Please enter grid size</label>' +
  //     '<input type="text" id="grid-size" value="' + grid_size + '">' +
  //     '</div>' +
  //     '</form>',
  //     buttons: {
  //       formSubmit: {
  //         text: 'Save',
  //         btnClass: 'btn-blue',
  //         action: function () {
  //           grid_size = +this.$content.find('#grid-size').val();
  //           reconfigDraggable();
  //         }
  //       },
  //       cancel: function () {
  //         // close
  //       },
  //     },
  //     onContentReady: function () {
  //       // bind to events
  //       var jc = this;
  //       this.$content.find('form').on('submit', function (e) {
  //           // if the user submits the form by pressing enter in the field.
  //           e.preventDefault();
  //           jc.$$formSubmit.trigger('click'); // reference the button and click it
  //       });
  //       this.$content.find('#grid-size').focus().select();
  //     },
  //     boxWidth: '300px',
  //     useBootstrap: false,
  //   });
    
  //   /*
  //   let size = prompt("Please enter grid size", grid_size);
  //   if (size != null) {
  //     grid_size = +size;

  //     reconfigDraggable();
  //   }
  //   */
  // });
  
  // $("#top-menu > ul > li").click(function() {
  //   $(this).addClass("active");
  //   $("#black-background").show();
    
  //   // Hide if click any where
  //   $("#black-background, #top-menu > ul > li.active > ul > li").click(function(e) {
  //     if (e.target !== this) return;
      
  //     setTimeout(function() {
  //       $("#top-menu > ul > li.active").removeClass("active");
  //       $("#black-background").hide();
  //     }, 0);
  //   });
  // });

  // $("#new-page").click(function() {
  //   $.confirm({
  //     title: 'New page',
  //     content: '' +
  //     '<form action="" class="formInDialog" autocomplete="off">' +
  //     '<div class="form-group">' +
  //     '<label>Name</label>' +
  //     '<input type="text" id="pageName" value="">' +
  //     '</div>' +
  //     '</form>',
  //     buttons: {
  //       formSubmit: {
  //         text: 'Add',
  //         btnClass: 'btn-blue',
  //         action: function () {
  //           let pageName = this.$content.find('#pageName').val();
  //           if (!(/^[A-Za-z0-9\-_]+$/.test(pageName))) {
  //             alert("Name of page on match, can use only A-Z, a-z, 0-9, -, _");
  //             return false;
  //           }
            
  //           savePageAndProject(); // Save old page
  //           removeAllComponent();
            
  //           project.pages.push(pageName);
  //           project.activePageName = pageName;
  //           updatePageListAndActive();
  //         }
  //       },
  //       cancel: function () {
  //         // close
  //       },
  //     },
  //     onContentReady: function () {
  //       // bind to events
  //       var jc = this;
  //       this.$content.find('form').on('submit', function (e) {
  //           // if the user submits the form by pressing enter in the field.
  //           e.preventDefault();
  //           jc.$$formSubmit.trigger('click'); // reference the button and click it
  //       });
  //       this.$content.find('#grid-size').focus().select();
  //     },
  //     boxWidth: '300px',
  //     useBootstrap: false,
  //   });
  // });
  
  // $("#new-project").click(function() {
  //   $.confirm({
  //     title: 'Create a new project',
  //     content: '' +
  //     '<form action="" class="formInDialog" autocomplete="off">' +
  //     '<div class="form-group">' +
  //     '<label>Name</label>' +
  //     '<input type="text" id="name" value="New-project">' +
  //     '<label>Path</label>' +
  //     '<div class="path-group"><input type="text" id="path" value="' + project.path + '"><button class="choose-path" data-active="#path" type="button">Choose</button></div>' +
  //     '<label>First page name</label>' +
  //     '<input type="text" id="page-name" value="index">' +
  //     '</div>' +
  //     '</form>',
  //     buttons: {
  //       formSubmit: {
  //         text: 'Create',
  //         btnClass: 'btn-blue',
  //         action: function () {
  //           var name = this.$content.find('#name').val();
  //           var projectPath = this.$content.find('#path').val();
  //           var pageName = this.$content.find('#page-name').val();
  //           if (!(/^[A-Za-z0-9\-_]+$/.test(name))) {
  //             alert("Name on match, can use only A-Z, a-z, 0-9, -, _");
  //             return false;
  //           }
  //           if (!fs.existsSync(projectPath)) {
  //             alert("Select path again");
  //             return false;
  //           }
  //           if (!(/^[A-Za-z0-9\-_]+$/.test(pageName))) {
  //             alert("Name of page on match, can use only A-Z, a-z, 0-9, -, _");
  //             return false;
  //           }
  //           projectPath = path.resolve(projectPath);
  //           project.name = name;
  //           project.path = projectPath;
  //           project.pages = [pageName];
  //           project.activePageName = pageName;
  //           updatePageListAndActive();
  //           savePageAndProject();
  //           $(".in-content").css("display", "flex");
  //           return true;
  //         }
  //       },
  //       cancel: function () {
  //         // close
  //       },
  //     },
  //     onContentReady: function () {
  //       // bind to events
  //       var jc = this;
  //       this.$content.find('form').on('submit', function (e) {
  //           // if the user submits the form by pressing enter in the field.
  //           e.preventDefault();
  //           jc.$$formSubmit.trigger('click'); // reference the button and click it
  //       });
        
  //       $(".choose-path").click(function() {
  //         $($(this).attr("data-active")).val(selectFolder());
  //       });
  //     },
  //     boxWidth: '380px',
  //     useBootstrap: false,
  //   });
  // });
  
  // // $("#new-project").click();
  
  // $("#open-project").click(function() {
  //   let path = dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: "KD", extensions: ["kd"] }] });
  //   if (path.length === 0) {
  //     return;
  //   }
    
  //   path = path[0];
  //   console.log(path);

  //   $("#active-bar").text("Load " + path + "...");
      
  //   let contentFile;
  //   try {
  //     contentFile = fs.readFileSync(path);
  //   } catch(err) {
  //     alert("Can't open file !");
  //     return;
  //   }
    
  //   let contentObj = JSON.parse(contentFile);
  //   let cutPath = path.match(/(.*)[\\\/][^\/\\]+[\\\/]([^\/\\]+).kd$/);
  //   project.name = cutPath[2];
  //   project.path = cutPath[1];
  //   project.pages = contentObj.pages;
  //   project.activePageName = null;
  //   updatePageListAndActive();
  //   $(".in-content").css("display", "flex");
          
  //   $("#page-list > li").first().click();
      
  //   $("#active-bar").text("Load " + path + " finish");
  // });
  
  // $("#close-project").click(function() {
    
  // });
  
  // $("#save").click(function() {
  //   $("#active-bar").text("Save " + project.activePageName + "...");
    
  //   savePageAndProject();
    
  //   $("#active-bar").text("Save " + project.activePageName + " finish");
  // });
  
  // $("#open-project-no-file-explorer").click(function() {
  //   shell.openItem(path.resolve(project.path + "/" + project.name));
  // });
  
  // $("#save-all").click(function() {
    
  // });
  
  // $("#exit").click(function() {
  //   remote.getCurrentWindow().close();
  // });
  
  // $("#manage-image").click(function() {
  //   $.dialog({
  //     title: 'Manage Image',
  //     content: 'Simple modal!',
  //     boxWidth: '800px',
  //     useBootstrap: false,
  //   });
  // });
  
  // $(".tabs > ul > li").click(function() {
  //   $(this).parent().find("li").removeClass("active");
  //   $(this).parents(".tabs").find("section > div").removeClass("active");
    
  //   $($(this).attr("data-active")).addClass("active");
  //   $(this).addClass("active");
  // });
  
  // $(".choose-path").click(function() {
  //   $($(this).attr("data-active")).val(selectFile());
  // });
  
  // // Hot key
  document.onkeyup = function(e) {
    if (e.which == 46) {
      let focus = $(".focus");
      let id = focus.attr("data-id");
      focus.remove();
      delete componentList[id];
      
      // Hide frame
      updateComponentFrame();
      
      $(".property-group > tbody").html("");
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
    
    $(".property-group > tbody").html("");
  });
  
  // $("#get-build-file").click(async function() {
  //   $("#active-bar").text("Building " + project.activePageName + "...");
    
  //   let path;
  //   try {
  //     path = await buildComponentsGetFile();
  //     if (path !== false) {
  //       shell.showItemInFolder(path);
  //     }
  //   } catch(err) {
  //     alert(err);
  //   }
    
  //   $("#active-bar").text("Build " + project.activePageName + " finish");
  // });
   
  // $("#upload-and-run").click(async function() {
  //   $("#active-bar").text("Building " + project.activePageName + "...");
    
  //   let pathOfBuild;
  //   try {
  //     pathOfBuild = await buildComponentsGetFile();
  //   } catch(err) {
  //     alert(err);
  //     return;
  //   }
    
  //   $("#active-bar").text("Uploading " + project.activePageName + "...");
    
  //   cmd = "\"" + path.resolve(app.getAppPath() + "/bin/KidUploader/KidUploader.exe") + "\" upload-run \"" + pathOfBuild + "\"";
  //   try {
  //     const { stdout, stderr } = await exec(cmd); // Run cmd
    
  //     console.log('stdout:', stdout);
  //     console.log('stderr:', stderr);
      
  //     $("#active-bar").text("Upload & Run " + project.activePageName + " finish");
  //   } catch (err) {
  //     /*
  //     err.status;  // Might be 127 in your example.
  //     err.message; // Holds the message you typically want.
  //     err.stderr;  // Holds the stderr output. Use `.toString()`.
  //     err.stdout;  // Holds the stdout output. Use `.toString()`.
  //     */
  //     alert(err.stdout);
      
  //     $("#active-bar").text("Upload & Run " + project.activePageName + " fail!");
  //   }
  // });
  
  // $("#upload").click(async function() {
  //   $("#active-bar").text("Building " + project.activePageName + "...");
    
  //   let pathOfBuild;
  //   try {
  //     pathOfBuild = await buildComponentsGetFile();
  //   } catch(err) {
  //     alert(err);
  //     return;
  //   }
    
  //   $("#active-bar").text("Uploading " + project.activePageName + "...");
    
  //   cmd = "\"" + path.resolve(app.getAppPath() + "/bin/KidUploader/KidUploader.exe") + "\" upload \"" + pathOfBuild + "\"";
  //   try {
  //     const { stdout, stderr } = await exec(cmd); // Run cmd
    
  //     console.log('stdout:', stdout);
  //     console.log('stderr:', stderr);
      
  //     $("#active-bar").text("Upload " + project.activePageName + " finish");
  //   } catch (err) {
  //     /*
  //     err.status;  // Might be 127 in your example.
  //     err.message; // Holds the message you typically want.
  //     err.stderr;  // Holds the stderr output. Use `.toString()`.
  //     err.stdout;  // Holds the stdout output. Use `.toString()`.
  //     */
  //     alert(err.stdout);
      
  //     $("#active-bar").text("Upload " + project.activePageName + " fail!");
  //   }
  // });
  
  // $("#run").click(async function() {
  //   $("#active-bar").text("Run " + project.activePageName + "...");
    
  //   cmd = "\"" + path.resolve(app.getAppPath() + "/bin/KidUploader/KidUploader.exe") + "\" run \"" + project.activePageName + "\"";
  //   try {
  //     const { stdout, stderr } = await exec(cmd); // Run cmd
    
  //     console.log('stdout:', stdout);
  //     console.log('stderr:', stderr);
      
  //     $("#active-bar").text("Run " + project.activePageName + " finish");
  //   } catch (err) {
  //     /*
  //     err.status;  // Might be 127 in your example.
  //     err.message; // Holds the message you typically want.
  //     err.stderr;  // Holds the stderr output. Use `.toString()`.
  //     err.stdout;  // Holds the stdout output. Use `.toString()`.
  //     */
  //     alert(err.stdout);
      
  //     $("#active-bar").text("Run " + project.activePageName + " fail!");
  //   }
  // });
  
  // $("#firmware-version").click(async function() {
  //   let cmd = "\"" + path.resolve(app.getAppPath() + "/bin/KidUploader/KidUploader.exe") + "\" version";
  //   try {
  //     const { stdout, stderr } = await exec(cmd); // Run cmd
    
  //     alert(stdout.trim());
  //   } catch (err) {
  //     /*
  //     err.status;  // Might be 127 in your example.
  //     err.message; // Holds the message you typically want.
  //     err.stderr;  // Holds the stderr output. Use `.toString()`.
  //     err.stdout;  // Holds the stdout output. Use `.toString()`.
  //     */
  //     alert(err.stdout);
  //   }
  // });
});