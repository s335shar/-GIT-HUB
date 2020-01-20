define("jira/admin/application/application-role-labels",["jira/util/logger","jquery","jira/skate","jira/admin/application/group-labels-store","jira/admin/group-browser/group-label-lozenge"],function(e,a,t,n){return t("application-role-labels",{type:t.type.ELEMENT,attached:function(e){e.syncLabelsHandler=e.updateLabels.bind(e),n.syncLabels(e.getGroupName(),e.getRoleKey(),e.syncLabelsHandler)},detached:function(e){n.removeHandler(e.syncLabelsHandler),n.fetchLabels()},prototype:{getGroupName:function(){return a(this).attr("data-group-name")},getRoleKey:function(){return a(this).attr("data-role-key")},updateLabels:function(t){this.innerHTML=t.filter(function(e){return"ADMIN"===e.type||"MULTIPLE"===e.type},this).map(function(e){return JIRA.Templates.groupLabelLozenge({label:e})}).join(" "),a(this).attr("updated",""),e.trace("role.editors.labels")}}})});