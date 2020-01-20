define("jira/admin/application/grouppicker",["jira/util/formatter","jquery","underscore","marionette","jira/ajs/select/single-select","jira/ajs/list/group-descriptor","jira/ajs/list/item-descriptor","wrm/context-path"],function(e,t,i,n,o,s,r,a){"use strict";var u=JIRA.Templates.Admin.ApplicationAccess,l=a();return n.ItemView.extend({initialize:function(){this._exclude=[]},onShow:function(){this.select=new o({element:this.ui.groups,itemAttrDisplayed:"label",showDropdownButton:!0,ajaxOptions:{data:function(e){return{query:e}},url:l+"/rest/api/2/groups/picker",query:!0,formatResponse:this._format.bind(this)}}),this.select.showErrorMessage=t.noop},tagName:"div",template:u.groupSingleSelect,ui:{groups:".ss-group-picker"},events:{"selected .ss-group-picker":"_changed"},_changed:function(){this.options.bus.trigger("selectGroup",this.ui.groups.val()[0]),this.select.clear()},excludeGroups:function(){this._exclude=i.union(this._exclude,i.toArray(arguments))},includeGroups:function(){this._exclude=i.difference(this._exclude,i.toArray(arguments))},_format:function(t){var n={weight:0},o=this._exclude,a=t.total,u=[];i.each(t.groups,function(e){i.contains(o,e.name)?a-=1:u.push(new r({value:e.name,label:e.name,html:e.html,highlighted:!0}))}),u.length<a&&(n.label=e.I18n.getText("application.access.configuration.groups.partial",u.length,a));var l=new s(n);return i.each(u,function(e){l.addItem(e)}),[l]},serializeData:function(){return{id:i.uniqueId()}},showLoading:function(){var e=this;return this.select&&!this._loading&&(this._loading=t(u.loading()),this._timeout=window.setTimeout(function(){e.ui.groups.before(e._loading)},100)),this},hideLoading:function(){return this._loading&&(window.clearTimeout(this._timeout),this._timeout=null,this._loading.remove(),delete this._loading),this}})}),define("jira/admin/application/approleeditor",["jquery","underscore","backbone","marionette","jira/skate","jira/admin/application/grouppicker","wrm/data","aui/inline-dialog2","jira/admin/application/application-role-labels"],function(e,t,i,n,o,s,r){"use strict";var a=JIRA.Templates.Admin.ApplicationAccess,u=r.claim("com.atlassian.jira.web.action.admin.application-access:upgrade-jira-url"),l=r.claim("com.atlassian.jira.web.action.admin.application-access:reduce-user-count-url"),c=r.claim("com.atlassian.jira.web.action.admin.application-access:managing-groups-url"),h=function(){return t.extend(this,i.Events)},p=i.Model.extend({defaults:{name:null,isDefault:!1,canRemove:!0,canToggle:!0},idAttribute:"name",disable:function(){this.set({canRemove:!1,canToggle:!1})},enable:function(){this.set({canToggle:!0,canRemove:!0})}}),d=i.Collection.extend({model:p}),g=i.Model.extend({defaults:{name:null,groups:null}}),f=n.ItemView.extend({template:a.roleEditorTableEmpty,tagName:"tr"}),m=n.Controller.extend({initialize:function(e){this.bus=e.bus,this.model=e.model,this.listenTo(this.bus,"showDefaultGroupWarning",this._showDefaultGroupWarning),this.listenTo(this.bus,"showAddGroupWarning",this._showAddGroupWarning)},_getApplicationRoleId:function(){return this.model.collection.applicationRoleModel.get("key")+"-"+this.model.cid},getDefaultGroupWarningId:function(){return"group-reuse-"+this._getApplicationRoleId()+"-default-warning"},getAddGroupWarningId:function(){return"group-reuse-"+this._getApplicationRoleId()+"-add-warning"},_showAddGroupWarning:function(e){this.model.get("name")===e&&this._showWarningDialog(this.getAddGroupWarningId())},_showDefaultGroupWarning:function(e){this.model.get("name")===e&&this._showWarningDialog(this.getDefaultGroupWarningId())},_showWarningDialog:function(t){var i=e("#"+t),n=i[0];o.init(n),i.one("aui-layer-hide",function(e){e.preventDefault(),i.remove()}),setTimeout(function(){n.open=!0},0)}}),_=n.ItemView.extend({template:a.roleEditorRow,tagName:"tr",events:{"click .application-role-remove":"_remove","change .application-role-default-input":"_toggleDefault"},modelEvents:{"change:isDefault change:canToggle change:canRemove change:userCount":"render"},initialize:function(e){this.bus=e.bus,this.warningController=new m({bus:this.bus,model:this.model})},onClose:function(){this.warningController.stopListening()},_remove:function(e){e.preventDefault(),this.bus.trigger("removeGroup",this.model.id)},_toggleDefault:function(e){var t=document.getElementById(this.warningController.getDefaultGroupWarningId());t&&(t.open=!1),e.preventDefault(),this.bus.trigger("toggleDefault",this.model.id)},_getAppsContainingGroup:function(e,i){return t.pairs(e).filter(function(e){return t.contains(e[1],i)}).map(function(e){return e[0]})},serializeData:function(){var e=this.model.collection.applicationRoleModel,i=e.get("defaultGroupsExistingInAnyOtherRoles"),n=e.get("appsAndDefaultRoles"),o=this.model.get("name"),s=this._getAppsContainingGroup(i,o),r=this._getAppsContainingGroup(n,o);return t.extend(this.model.toJSON(),{appsReusingGroup:s,appsWhereGroupIsDefault:r,roleKey:this.model.collection.applicationRoleModel.get("key"),roleName:this.model.collection.applicationRoleModel.get("name"),defaultGroupWarningId:this.warningController.getDefaultGroupWarningId(),addGroupWarningId:this.warningController.getAddGroupWarningId(),managingGroupsUrl:c})}}),w=n.CompositeView.extend({template:a.roleEditorTable,itemView:_,itemViewContainer:"tbody",emptyView:f,modelEvents:{"change:userCount change:numberOfSeats change:remainingSeats change:hasUnlimitedSeats change:defaultGroupsExistingInAnyOtherRoles change:selectedByDefault":"render"},collectionEvents:{"change:isDefault":"render"},initialize:function(e){this.bus=e.bus,this.itemViewOptions={bus:this.bus}},_getDialogId:function(){return"user-count-details-"+this.model.get("key")},serializeData:function(){var e=this.collection.some(function(e){return e.get("isDefault")});return t.extend({hasDefaultGroup:e,upgradeJIRAUrl:u,reduceUserCountUrl:l,dialogId:this._getDialogId()},this.model.toJSON())}}),v=n.Layout.extend({template:a.roleEditor,regions:{table:".application-role-editor-container",groupSelector:".application-role-selector-container"},events:{"submit .application-role-editor-form":"_submit"},onShow:function(){this.table.show(new w(t.pick(this.options,"model","collection","bus")));var e=this.groupPicker=new s(t.pick(this.options,"bus"));e.excludeGroups.apply(e,this.options.collection.pluck("name")),this.groupSelector.show(e),this.listenTo(this.options.bus,"removeGroup",function(t){e.includeGroups(t)}),this.listenTo(this.options.bus,"selectGroup",function(t){e.excludeGroups(t),this.options.bus.trigger("addGroup",t)})},_submit:function(e){e.preventDefault()},showLoading:function(){return this.groupPicker&&this.groupPicker.showLoading(),this},hideLoading:function(){return this.groupPicker&&this.groupPicker.hideLoading(),this}}),b=function(i){this._put=i.setRole||e.noop,this.IO=i.IO;var n=this._toModel(i.data||{});this._groups=n.get("groups"),this._active=0,this.bus=i.bus||new h,this.view=new v({model:n,collection:this._groups,bus:this.bus}),this.listenTo(this.bus,"removeGroup",this._removeGroup),this.listenTo(this.bus,"toggleDefault",this._toggleDefault),this.listenTo(this.bus,"addGroup",this._addGroup),t.each(this._getGroupNames(),this._loadUserCountForGroup,this)};return t.extend(b.prototype,i.Events,{_toggleDefault:function(e){var i=this._getGroupNames(),n=this._getDefaultGroupNames(),o=this._groups.get(e);if(o){var s=o.get("isDefault");s?(n=t.without(n,e),1===n.length&&this._groups.get(n[0]).disable()):(n.push(e),n.length>1?t.each(n,function(e){this._groups.get(e).enable()},this):o.disable()),o.set("isDefault",!s),this._setRole(i,n).done(function(){!s&&this._canShowDefaultGroupWarning(e)&&this.bus.trigger("showDefaultGroupWarning",e)}.bind(this))}},_canShowDefaultGroupWarning:function(e){var i=this._groups.applicationRoleModel.get("defaultGroupsExistingInAnyOtherRoles");return t.contains(t.flatten(t.values(i)),e)},_removeGroup:function(e){var i=this._groups.get(e),n=this._getGroupNames(),o=this._getDefaultGroupNames();if(i&&i.get("canRemove")){var s=t.without(n,e),r=t.without(o,e);this._groups.remove(i),1===r.length?this._groups.get(r[0]).disable():1===s.length&&this._groups.get(s[0]).set("canRemove",!1),this._setRole(s,r)}},_addGroup:function(e){if(!this._groups.get(e)){var t=this._getGroupNames();if(t.push(e),1===this._groups.size()){var i=this._groups.at(0);i.get("canRemove")||i.get("isDefault")||i.set("canRemove",!0)}this._groups.add({name:e,isDefault:!1,canRemove:t.length>1,canToggle:!0}),this._loadUserCountForGroup(e),this._setRole(t,this._getDefaultGroupNames()).done(function(){this._getApplicationsWhereTheRoleIsDefault(e,this._groups.applicationRoleModel.get("appsAndDefaultRoles")).length>0&&this.bus.trigger("showAddGroupWarning",e)}.bind(this))}},_loadUserCountForGroup:function(e){this.IO.getGroupDetails(e).then(function(e){var t=this._groups.get(e.name);t&&t.set("userCount",e.users.size)}.bind(this))},_getApplicationsWhereTheRoleIsDefault:function(e,i){return t.pairs(i).filter(function(i){return t.contains(i[1],e)}).map(function(e){return e[0]})},_setRole:function(e,t){return 0===this._active&&this.view.showLoading(),this._active++,this._put(e||[],t||[]).always(function(e){this._active=Math.max(0,this._active-1),0===this._active&&this.view.hideLoading(),e&&this.view.model.set({remainingSeats:e.remainingSeats,numberOfSeats:e.numberOfSeats,userCount:e.userCount,hasUnlimitedSeats:e.hasUnlimitedSeats})}.bind(this))},_getDefaultGroupNames:function(){return t.map(this._groups.where({isDefault:!0}),function(e){return e.get("name")})},_getGroupNames:function(){return this._groups.pluck("name")},_toModel:function(e){var i=new d,n=e.groups||[],o=t.intersection(n,e.defaultGroups||[]);i.add(t.map(n,function(e){var i=t.contains(o,e);return new p({isDefault:i,name:e,canToggle:!i||o.length>1,canRemove:n.length>1&&(!i||o.length>1)})}));var s=new g({key:e.key,name:e.name||"",groups:i,defined:e.defined,selectedByDefault:e.selectedByDefault,userCount:e.userCount,userCountDescription:e.userCountDescription,remainingSeats:e.remainingSeats,numberOfSeats:e.numberOfSeats,hasUnlimitedSeats:e.hasUnlimitedSeats,defaultGroupsExistingInAnyOtherRoles:e.defaultGroupsExistingInAnyOtherRoles||{},appsAndDefaultRoles:e.appsAndDefaultRoles||{}});return i.applicationRoleModel=s,s}}),b}),define("jira/admin/application/approleseditor",["jira/util/formatter","jira/util/logger","jira/jquery/deferred","jquery","underscore","backbone","marionette","jira/ajs/ajax/smart-ajax/web-sudo","jira/dialog/error-dialog","jira/admin/application/approleeditor","jira/admin/application/defaults","wrm/context-path"],function(e,t,i,n,o,s,r,a,u,l,c,h){"use strict";var p=JIRA.Templates.Admin.ApplicationAccess,d=h(),g=function(t,i){"abort"!==i&&(t&&400!==t.status?u.openErrorDialogForXHR(t):new u({message:e.I18n.getText("application.access.configuration.out.of.date"),mode:"warning"}).show())},f=function(e,t){return e=e||"",t=t||"",e.localeCompare(t)},m=function(e){this._queued=[],this._requests={},this._defaultFail=e.defaultFail||null,this._current=null,this._aborted=!1,this._websudo=!1};o.extend(m.prototype,{busy:function(){return null!=this._current||this._queued.length>0},sudoVisible:function(){return this._websudo},getRoles:function(){var e=this;return this._wrap(this._ajax({url:this._makeAllUrl(),dataType:"json"}).then(function(t,i,n){return o.each(t,function(t){e._sortGroups(t)}),{applicationRoles:t,versionHash:n.getResponseHeader("ETag")}}))},getGroupDetails:function(e){return this._wrap(this._ajax({url:this._makeGroupUrl(e),dataType:"json"}))},putRole:function(e,t,i,n,s){var r={groups:o.toArray(t),defaultGroups:o.toArray(i),selectedByDefault:n};return this._wrap(this._ajaxForPut(e,{url:this._makeRoleUrl(e),dataType:"json",type:"PUT",contentType:"application/json",headers:{"If-Match":s},data:JSON.stringify(r)})).then(this._sortGroups)},putRoles:function(e){var t=this;return this._wrap(this._ajaxForPut("all",{url:this._makeAllUrl(),dataType:"json",type:"PUT",contentType:"application/json",headers:{"If-Match":e.versionHash},data:JSON.stringify(e)})).then(function(e,i,n){return o.each(e,function(e){t._sortGroups(e)}),{applicationRoles:e,versionHash:n.getResponseHeader("ETag")}})},_sortGroups:function(e){return e&&e.groups&&e.groups.sort(f),e},_makeGroupUrl:function(e){return d+"/rest/api/2/group?groupname="+encodeURIComponent(e)},_makeRoleUrl:function(e){return d+"/rest/api/2/applicationrole/"+e},_makeAllUrl:function(){return d+"/rest/api/2/applicationrole"},abort:function(){this._current&&this._current.result.reject(null,"abort"),o.each(this._requests,function(e){e.result.reject(null,"abort")}),this._current=null,this._queued=[],this._requests={},this._aborted=!0},_activate:function(e){this._current=e;var t=this,i=this._ajax(e.options,{beforeShow:function(){t._websudo=!0}});i.fail(function(){e.result.rejectWith.call(e.result,this,o.toArray(arguments)),t._current=null,t.abort()}),i.done(function(){e.result.resolveWith.call(e.result,this,o.toArray(arguments)),t._dequeue()}),i.always(function(){t._websudo=!1})},_dequeue:function(){this._current=null;var e=this._queued.shift();if(e){var i=this._requests[e];delete this._requests[e],this._activate(i)}else t.trace("role.put.finished")},_ajaxForPut:function(e,t){if(this._aborted)return i().reject(null,"abort");var n={roleKey:e,result:i(),options:t};if(null==this._current)this._activate(n);else{var o=this._requests[e];o?o.result.reject(null,"abort"):this._queued.push(e),this._requests[e]=n}return n.result.promise()},_ajax:function(e,t){return a.makeWebSudoRequest(e,t||{})},_wrap:function(e){return e&&this._defaultFail&&e.fail(this._defaultFail),e}});var _=s.Model.extend({defaults:{name:null,groups:null,defaultGroups:null,selectedByDefault:!1},idAttribute:"key",update:function(e){return e=o.extend(this.toJSON(),e),this.collection.IO.putRole(e.key,e.groups,e.defaultGroups,e.selectedByDefault,this.collection.versionHash).done(function(e){o.pairs(e).forEach(function(e){this.set.apply(this,e)},this)}.bind(this))},defaultGroupsExistingInAnyOtherRoles:function(){var e=this,t=this.collection.models.filter(function(t){return t!==e}),i=o.object(t.map(function(e){return e.get("name")}),t.map(function(t){return o.intersection(e.get("defaultGroups"),t.get("groups"))}));return o.object(o.pairs(i).filter(function(e){return!o.isEmpty(e[1])}))},appsAndDefaultRoles:function(){var e=this,t=this.collection.models.filter(function(t){return t!==e});return o.object(t.map(function(e){return e.get("name")}),t.map(function(e){return e.get("defaultGroups")}))}}),w=s.Collection.extend({model:_,versionHash:null,initialize:function(e,t){this.IO=t.IO,this._fetched=i(),this.IO.getRoles().done(function(e){this.versionHash=e.versionHash,this.reset(e.applicationRoles)}.bind(this)).fail(function(){this._fetched.reject()}.bind(this)),this.once("reset",function(){this._fetched.resolve()})},parse:function(e){return e.applicationRoles},whenFetched:function(){return this._fetched.promise()},reload:function(){return this.IO.getRoles().done(function(e){this.set(e.applicationRoles),this.versionHash=e.versionHash}.bind(this))},updateDefaults:function(){return this.IO.putRoles(this).done(function(e){this.versionHash=e.versionHash}.bind(this))}}),v=r.ItemView.extend({tagName:"div",template:p.noRoles}),b=r.CollectionView.extend({itemView:l,tagName:"div",emptyView:v,initialize:function(){this.updateEditors=this.options.updateEditors||n.noop},collectionEvents:{change:"updateEditors"},buildItemView:function(e,t){return t===this.itemView?this.options.buildRoleEditor(e):r.CollectionView.prototype.buildItemView.apply(this,arguments)}}),G=r.ItemView.extend({template:p.roleEditorEmpty,onShow:function(){var e=this;this.timeout=window.setTimeout(function(){e.ui.icon.css({visibility:"visible"})},250)},onClose:function(){window.clearTimeout(this.timeout)},ui:{icon:".icon"}});return function(s){if(s.el){var a=n(s.el);if(a.length){var u=new r.Region({el:a});a.addClass("loading"),u.show(new G);var h=s.IO||new m({defaultFail:g}),p=new w([],{IO:h});new c(p),p.whenFetched().then(function(){var e=new b({collection:p,buildRoleEditor:function(e){var t=e.id;return new l({data:o.extend(e.toJSON(),{defaultGroupsExistingInAnyOtherRoles:e.defaultGroupsExistingInAnyOtherRoles(),appsAndDefaultRoles:e.appsAndDefaultRoles()}),IO:h,setRole:function(n,o){var s=p.get({id:e.get("key")});if(s){return s.update({id:t,groups:n,defaultGroups:o}).then(function(e){return p.reload(),e})}return i().reject()}}).view},updateEditors:function(){u.currentView.children.each(function(e){var t=e.model.get("key"),i=p.get(t).toJSON(),n=p.get(t);i&&e.model.set({userCount:i.userCount,numberOfSeats:i.numberOfSeats,remainingSeats:i.remainingSeats,defaultGroupsExistingInAnyOtherRoles:n.defaultGroupsExistingInAnyOtherRoles(),appsAndDefaultRoles:n.appsAndDefaultRoles(),selectedByDefault:i.selectedByDefault})}),t.trace("role.editors.updated")}});u.show(e)}).always(function(){a.removeClass("loading")});var d=window.onbeforeunload;window.onbeforeunload=function(){var t=d&&d.call(window);return t||h.busy()&&(h.sudoVisible()?h.abort():t=e.I18n.getText("application.access.configuration.active.ajax")),t||void 0}}}}});