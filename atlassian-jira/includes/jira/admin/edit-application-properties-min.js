require(["jquery","backbone","jira/util/init-on-dcl"],function(e,i,t){"use strict";var a=i.View.extend({events:{"click input[name=useGravatar]:checked":"_onUseGravatarClicked"},initialize:function(e){i.View.prototype.initialize.call(this,arguments),this._gravatarServer=this.$el.find(".gravatar-server")},_onUseGravatarClicked:function(e){var i="true"===this.$(e.target).val();this._gravatarServer.toggleClass("hidden",!i)}});t(function(){e("#edit-application-properties").each(function(){new a({el:this})})})});