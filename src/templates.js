module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["existspopup.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h3>\n    This parcel is already part of a lot. This will fail if you try to add it.\n</h3>\n<p>\n    <a href=\""
    + container.escapeExpression(((helper = (helper = helpers.lotUrl || (depth0 != null ? depth0.lotUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"lotUrl","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">View the existing lot's page</a>\n</p>\n";
},"useData":true});

this["JST"]["failure.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"map-add-lot-mode-container\">\n    <h1>Failure</h1>\n    <p>Something went wrong while trying to add your lot(s). Sorry about that.</p>\n    <p>The most likely reason that this happened is that the lot already exists.</p>\n    <p>Please try again and let us know if it continues to fail.</p>\n    <div class=\"map-add-lot-actions\">\n        <a href=\"#\" class=\"add-lot-mode-cancel btn btn-default\">close</a>\n    </div>\n</div>\n";
},"useData":true});

this["JST"]["success.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"map-add-lot-mode-container\">\n    <h1>Success</h1>\n    <p>Successfully added the lot(s).</p>\n    "
    + ((stack1 = ((helper = (helper = helpers.successMessage || (depth0 != null ? depth0.successMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"successMessage","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    <div class=\"map-add-lot-actions\">\n        <a href=\"#\" class=\"add-lot-mode-view btn btn-default\" target=\"_blank\">view</a>\n        <a href=\"#\" class=\"add-lot-mode-edit btn btn-default\" target=\"_blank\">edit</a>\n        <a href=\"#\" class=\"add-lot-mode-cancel btn btn-default\">close</a>\n    </div>\n</div>\n";
},"useData":true});

this["JST"]["window.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <div>\n            Adding a lot for these "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.parcels : depth0)) != null ? stack1.length : stack1), depth0))
    + " selected parcels:\n            <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.parcels : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n        </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <li>"
    + container.escapeExpression(((helper = (helper = helpers.address || (depth0 != null ? depth0.address : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"address","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "        <div>\n            Adding a lot for the lots you have drawn.\n        </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"map-add-lot-mode-container\">\n    <h1>You are in add-a-lot mode</h1>\n    <div class=\"map-add-lot-zoom-message\">Zoom in to see parcel outlines</div>\n    <div>\n        Currently over:\n        <span class=\"map-add-lot-current-parcel\"></span>\n    </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.parcels : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.drawnLots : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"map-add-lot-actions\">\n        <a href=\"#\" class=\"add-lot-mode-cancel btn btn-default\">cancel</a>\n        <a href=\"#\" class=\"add-lot-mode-draw btn btn-default\">draw lot</a>\n        <a href=\"#\" class=\"add-lot-mode-submit btn btn-default "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.canSubmit : depth0),{"name":"unless","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">add lot</a>\n    </div>\n</div>\n";
},"useData":true});

return this["JST"];

};