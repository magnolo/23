(function(){
	"use strict";

	angular.module('app.directives').directive('previewCanvas', function() {
    return {
      //require: '?resizableCanvas',
      link: function(scope, elem, attrs, resizableCanvasCtrl) {
        var canvasDom, ctx, dependentDataChange, getDependentData, jsCodePrecision;
        canvasDom = elem[0];
        ctx = canvasDom.getContext('2d');
        jsCodePrecision = 3;
        /*
              @return {Object} Data on which the canvas rendering depends.
        */

        getDependentData = function() {
          return {
            ColorHandles: scope.$eval(attrs.colorHandles),
            gradientType: scope.$eval(attrs.gradientType),
            width: elem.prop('width'),
            height: elem.prop('height'),
            rotateDegrees: scope.$eval(attrs.rotate),
            innerCircleX: scope.$eval(attrs.innerCircleX),
            innerCircleY: scope.$eval(attrs.innerCircleY),
            outerCircleX: scope.$eval(attrs.outerCircleX),
            outerCircleY: scope.$eval(attrs.outerCircleY)
          };
        };
        /*
              @param {Object} dependentData Result of {@link getDependentData()}.
        */

        dependentDataChange = function(dependentData) {
          var ColorHandle, ColorHandles, a, b, g, gradientType, grd, height, innerCircleX, innerCircleY, matches, outerCircleX, outerCircleY, r, r1, r1Fixed, r2, r2Fixed, regEx, rotateDegrees, scaleX, scaleY, width, x1, x1Fixed, x2, x2Fixed, y1, y1Fixed, y2, y2Fixed, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
          ColorHandles = dependentData.ColorHandles;
          gradientType = dependentData.gradientType;
          width = dependentData.width;
          height = dependentData.height;
          rotateDegrees = (_ref = dependentData.rotateDegrees) != null ? _ref : 0;
          innerCircleX = (_ref1 = dependentData.innerCircleX) != null ? _ref1 : 50;
          innerCircleY = (_ref2 = dependentData.innerCircleY) != null ? _ref2 : 50;
          outerCircleX = (_ref3 = dependentData.outerCircleX) != null ? _ref3 : 50;
          outerCircleY = (_ref4 = dependentData.outerCircleY) != null ? _ref4 : 50;
          if (attrs.htmlCode) {
            scope[attrs.htmlCode] = "<canvas id=\"myPrettyCanvas\" width=\"" + width + "\" height=\"" + height + "\"></canvas>";
          }
          if (attrs.jsCode) {
            scope[attrs.jsCode] = "var canvasId = 'myPrettyCanvas',\n    canvas = document.getElementById(canvasId),\n    ctx = canvas.getContext('2d'),\n    grd;\n\n";
          }
          scaleX = 1;
          scaleY = 1;
          switch (gradientType) {
            case 'linear':
              if ((0 <= rotateDegrees && rotateDegrees < 45)) {
                x1 = 0;
                y1 = height / 2 * (45 - rotateDegrees) / 45;
                x2 = width;
                y2 = height - y1;
              } else if ((45 <= rotateDegrees && rotateDegrees < 135)) {
                x1 = width * (rotateDegrees - 45) / (135 - 45);
                y1 = 0;
                x2 = width - x1;
                y2 = height;
              } else if ((135 <= rotateDegrees && rotateDegrees < 225)) {
                x1 = width;
                y1 = height * (rotateDegrees - 135) / (225 - 135);
                x2 = 0;
                y2 = height - y1;
              } else if ((225 <= rotateDegrees && rotateDegrees < 315)) {
                x1 = width * (1 - (rotateDegrees - 225) / (315 - 225));
                y1 = height;
                x2 = width - x1;
                y2 = 0;
              } else if (315 <= rotateDegrees) {
                x1 = 0;
                y1 = height - height / 2 * (rotateDegrees - 315) / (360 - 315);
                x2 = width;
                y2 = height - y1;
              }
              grd = ctx.createLinearGradient(x1, y1, x2, y2);
              if (attrs.jsCode) {
                x1Fixed = x1.toFixed(jsCodePrecision);
                y1Fixed = y1.toFixed(jsCodePrecision);
                x2Fixed = x2.toFixed(jsCodePrecision);
                y2Fixed = y2.toFixed(jsCodePrecision);
                scope[attrs.jsCode] += "// Create gradient\ngrd = ctx.createLinearGradient(" + x1Fixed + ", " + y1Fixed + ", " + x2Fixed + ", " + y2Fixed + ");\n\n";
              }
              break;
            case 'radial':
              if (width > height) {
                scaleY = height / width;
              }
              if (height > width) {
                scaleX = width / height;
              }
              ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
              grd = ctx.createRadialGradient(x1 = (width * innerCircleX / 100) / scaleX, y1 = (height * innerCircleY / 100) / scaleY, r1 = 0, x2 = (width * outerCircleX / 100) / scaleX, y2 = (height * outerCircleY / 100) / scaleY, r2 = (width / 2) / scaleX);
              if (attrs.jsCode) {
                if (scaleX !== 1 || scaleY !== 1) {
                  scope[attrs.jsCode] += "// Transform to facilitate ellipse\nctx.setTransform(" + scaleX + ", 0, 0, " + scaleY + ", 0, 0);\n\n";
                }
                x1Fixed = x1.toFixed(jsCodePrecision);
                y1Fixed = y1.toFixed(jsCodePrecision);
                r1Fixed = r1.toFixed(jsCodePrecision);
                x2Fixed = x2.toFixed(jsCodePrecision);
                y2Fixed = y2.toFixed(jsCodePrecision);
                r2Fixed = r2.toFixed(jsCodePrecision);
                scope[attrs.jsCode] += "// Create gradient\ngrd = ctx.createRadialGradient(" + x1Fixed + ", " + y1Fixed + ", " + r1Fixed + ", " + x2Fixed + ", " + y2Fixed + ", " + r2Fixed + ");\n\n";
              }
              break;
            default:
              throw 'Unknown gradient type.';
          }
          if (attrs.jsCode) {
            scope[attrs.jsCode] += '// Add colors\n';
          }
          for (_i = 0, _len = ColorHandles.length; _i < _len; _i++) {
            ColorHandle = ColorHandles[_i];
            if (!ColorHandle.color) {
              continue;
            }
            grd.addColorStop(ColorHandle.stop, ColorHandle.color);
            if (attrs.jsCode) {
              regEx = /([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)/;
              matches = regEx.exec(ColorHandle.color);
              r = matches[1];
              g = matches[2];
              b = matches[3];
              a = parseFloat(matches[4]).toFixed(jsCodePrecision);
              scope[attrs.jsCode] += "grd.addColorStop(" + (ColorHandle.stop.toFixed(jsCodePrecision)) + ", 'rgba(" + r + ", " + g + ", " + b + ", " + a + ")');\n";
            }
          }
          if (attrs.jsCode) {
            scope[attrs.jsCode] += '\n';
          }
          ctx.clearRect(0, 0, width / scaleX, height / scaleY);
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, width / scaleX, height / scaleY);
          if (attrs.jsCode) {
            scope[attrs.jsCode] += "// Fill with gradient\nctx.fillStyle = grd;\nctx.fillRect(0, 0, " + ((width / scaleX).toFixed(jsCodePrecision)) + ", " + ((height / scaleY).toFixed(jsCodePrecision)) + ");";
          }
          // if (resizableCanvasCtrl != null) {
          //   return resizableCanvasCtrl.drawResizeIcon();
          // }
        };
        return scope.$watch(getDependentData, dependentDataChange, true);
      }
    };
  });

})();
