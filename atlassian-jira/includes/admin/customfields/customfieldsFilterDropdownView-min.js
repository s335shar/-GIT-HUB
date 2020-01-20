define("jira/customfields/customfieldsFilterDropdownView",["atlassian/libs/underscore-1.8.3","jira/marionette-4.1","jira/util/formatter","jira/util/logger","jira/customfields/customfieldsFilterCollectionView"],function(e,t,i,s,l){"use strict";return t.View.extend({tagName:"aui-dropdown-menu",template:JIRA.Templates.Admin.Customfields.filterDropdownContainer,templateContext:function(){var e="",t="";switch(this.collection.name){case"projects":e=i.I18n.getText("common.filters.allprojects"),t=i.I18n.getText("common.filters.findprojects");break;case"screens":e=i.I18n.getText("common.filters.all.screens"),t=i.I18n.getText("common.filters.find.screens");break;case"types":e=i.I18n.getText("common.filters.all.customfield.types"),t=i.I18n.getText("common.filters.find.customfield.types")}return{title:e,placeholder:t,isAnySelected:this.options.customfieldCollection.filters[this.collection.id].length>0}},ui:{searchFilter:".customfield-filter-text-search-input",clearButton:".clear-selected",selectedItemsContainer:".customfield-filter-selected-items-container",unselectedItemsContainer:".unselected-items-container",heading:".aui-dropdown2-heading"},regions:{allItems:{el:".unselected-items",replaceElement:!0},selectedItems:{el:".selected-items",replacement:!0}},events:{"input @ui.searchFilter":"onSearchFilterChange","click @ui.clearButton":"onFilterClear","blur @ui.searchFilter":"focusField"},childViewEvents:{"filter:changed":"onChildviewFilterChanged"},initialize:function(){this.filtersCollectionView=new l({collection:this.collection,customfieldCollection:this.options.customfieldCollection}),this.selectedFiltersCollectionView=new l({collection:this.collection,customfieldCollection:this.options.customfieldCollection}),this.render()},onRender:function(){this.showChildView("allItems",this.filtersCollectionView),this.showChildView("selectedItems",this.selectedFiltersCollectionView)},onChildviewFilterChanged:function(e){this.triggerMethod("filter:changed",e),this.focusField()},onSearchFilterChange:e.debounce(function(e){e.preventDefault(),e.currentTarget.value.length>0?(this.filtersCollectionView.setFilter(!1),this.selectedFiltersCollectionView.setFilter(function(t){return t.model.get("name").search(new RegExp(e.currentTarget.value,"i"))>=0},{preventRender:!0}),this.filtersCollectionView.render(),this.selectedFiltersCollectionView.render(),this.getUI("clearButton").hide(),this.getUI("selectedItemsContainer").toggleClass("aui-dropdown2-section",!1).show(),this.getUI("unselectedItemsContainer").hide()):(this.reorderItems(),this.focusField()),s.trace("cf.filter.search.change")},300),onFilterClear:function(){this.getOption("customfieldCollection").filters[this.collection.id].length=0,this.reorderItems(),this.triggerMethod("filter:cleared",this.collection),this.focusField()},startLoading:function(){this.getUI("searchFilter").hide(),this.getUI("heading").hide(),this.getUI("unselectedItemsContainer").hide(),this.getUI("selectedItemsContainer").hide(),this.$el.spin("medium")},stopLoading:function(){this.fetched=!0,this.getUI("searchFilter").show(),this.getUI("heading").show(),this.getUI("unselectedItemsContainer").show(),this.getUI("selectedItemsContainer").show(),this.$el.spinStop()},reorderItems:function(){var e=this;this.fetched?this.splitColumns():(this.startLoading(),this.fetchProgress=this.fetchProgress||this.collection.fetch().then(function(){e.stopLoading(),e.splitColumns()}))},splitColumns:function(){var t=this.getOption("customfieldCollection").filters[this.collection.id],i=!t.length;this.getUI("searchFilter").val(""),this.getUI("unselectedItemsContainer").show(),this.filtersCollectionView.setFilter(function(i){return!e.contains(t,i.model.get("id").toString())},{preventRender:!0}),this.selectedFiltersCollectionView.setFilter(function(i){return e.contains(t,i.model.get("id").toString())},{preventRender:!0}),this.filtersCollectionView.render(),this.selectedFiltersCollectionView.render(),i?(this.getUI("clearButton").hide(),this.getUI("selectedItemsContainer").toggleClass("aui-dropdown2-section",!1).hide()):(this.getUI("clearButton").show(),this.getUI("selectedItemsContainer").toggleClass("aui-dropdown2-section",!0).show())},focusField:function(){var e=this;return setTimeout(function(){return e.getUI("searchFilter").focus()},0)}})});