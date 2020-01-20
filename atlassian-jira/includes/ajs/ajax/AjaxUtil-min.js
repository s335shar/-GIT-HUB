define("jira/ajs/ajax/ajax-util",["jira/util/formatter","underscore","exports"],function(r,e,t){"use strict";var s=function(r){if(r){if(e.isArray(r.errorMessages)&&!e.isEmpty(r.errorMessages))return r.errorMessages.join(" ");if(e.isObject(r.errors)&&!e.isEmpty(r.errors))return e.values(r.errors).join(" ")}return null},n=function(r){var e;try{return e=r.responseText&&JSON.parse(r.responseText),s(e)}catch(r){}return null},a=function(e){return 401===e.status?r.I18n.getText("common.ajax.unauthorised.alert"):e.responseText?r.I18n.getText("common.ajax.servererror"):r.I18n.getText("common.ajax.commserror")},o=/websudo/i;t.getErrorMessageFromXHR=function(r){return n(r)||a(r)},t.isWebSudoFailure=function(r){return r&&401===r.status&&o.test(r.responseText)}}),AJS.namespace("JIRA.Ajax",null,require("jira/ajs/ajax/ajax-util"));