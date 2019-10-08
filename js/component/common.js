let updatePos = function(element) {
  let left = 0;
  if (this.property.alignX == 0) { // Left
    left = this.property.x;
  } else if (this.property.alignX == 1) { // Center
    left = `calc(50% - ${(element.offsetWidth / 2) - this.property.x}px)`
  } else if (this.property.alignX == 2) { // Right
    left = `calc(100% - ${element.offsetWidth - this.property.x}px)`
  }

  let top = 0;
  if (this.property.alignY == 0) { // Top
    top = this.property.y;
  } else if (this.property.alignY == 1) { // Mid
    top = `calc(50% - ${(element.offsetHeight / 2) - this.property.y}px)`
  } else if (this.property.alignY == 2) { // Bottom
    top = `calc(100% - ${element.offsetHeight - this.property.y}px)`
  }

  $(element).css({
    left: left,
    top: top,
  });
};
