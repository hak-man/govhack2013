
Ext.onReady(function() {
	
	//---
	// Left menu, using Meny
	//---
	
	var leftMenu = Meny.create({
	    menuElement: document.querySelector( '.meny' ),
	    contentsElement: document.querySelector( '.contents' ),
	    position: 'top',
	    height: 200,
	    width: 260
	});
	
	//---
	// Extjs stuff
	//---
	
	Ext.QuickTips.init();

	//---
	// Map
	//---
	
	var map = new OpenLayers.Map({
		controls: [new OpenLayers.Control.PanPanel(), new OpenLayers.Control.ZoomPanel(), new OpenLayers.Control.ScaleLine(), new OpenLayers.Control.Attribution(), new OpenLayers.Control.KeyboardDefaults()]
	});
	
	var layer = new OpenLayers.Layer.WMS(
			"Blue Marble - Global Imagery",
			"http://maps.opengeo.org/geowebcache/service/wms",
			{layers: "bluemarble"}, {wrapDateLine: true}
	);
	var openStreetMap = new OpenLayers.Layer.WMS( "OSGEO Base Map",
			"http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'}, {wrapDateLine: true} ); 
	
	// create our heatmap layer
	var heatmap = new OpenLayers.Layer.Heatmap("Heatmap Layer", map, layer, 
			{visible: true, radius:10}, 
			{isBaseLayer: false, opacity: 0.3, projection: new OpenLayers.Projection("EPSG:4326"), wrapDateLine: true});
	
	
	map.addLayer(layer);
	map.addLayer(openStreetMap);
	map.addLayer(heatmap);
	
	//---
	// Heatmap test data
	//---
	
	var randDbl = function(offset, range) {
		if (!offset) offset = 0;
		if (!range) range = 5;
		return Math.random() * range - range + offset;
	}
	
	var randInt = function(offset, range) {
		return Math.floor(randDbl(offset, range)); 
	}
	
	var data = [];
	for (var i=0; i<1000; ++i) {
		data.push({lat: randDbl(-34), lon: randDbl(138), count:  randInt(10) + 5})
	}
	
	// here is our dataset
	// important: a datapoint now contains lat, lng and count property!
	var testData={
		max: 10,
		data: data
	};
	
	
	var transformedTestData = { max: testData.max , data: [] },
	data = testData.data,
	datalen = data.length,
	nudata = [];
	 
	// in order to use the OpenLayers Heatmap Layer we have to transform our data into
	// { max: , data: [{lonlat: , count: },...]}
	while(datalen--){
		nudata.push({
			lonlat: new OpenLayers.LonLat(data[datalen].lon, data[datalen].lat),
			count: data[datalen].count
		});
	}
	transformedTestData.data = nudata;
	
	console.dir(transformedTestData);
	
	//heatmap.setDataSet(transformedTestData);
	
	//---
	// Controls
	//---

	var zoomSlider = new GeoExt.ZoomSlider({
		map: map,
		aggressive: true,
		vertical: true,
		height: 100,
		plugins: new GeoExt.ZoomSliderTip({
			template: "<div>Zoom Level: {zoom}</div><div>Scale: 1 : {scale}</div>"
		})
	});

	var panZoom = new GeoExt.Action({
		tooltip: "Pan and zoom around the map",
		iconCls: "gxp-icon-pan",
		toggleGroup: "navigation",
		pressed: true,
		allowDepress: false,
		control: new OpenLayers.Control.Navigation(),
		map: map,
		handler: function () {
			Ext.getCmp("map").body.applyStyles("cursor:default");
			var element = document.getElementById("output");
			element.innerHTML = "";
			layerRuler.removeFeatures(layerRuler.features);
		}
	});

	var togglePanels = [{id: "toolPanel"}, {id: "headerPanel"}, {id: "statusPanel"}];

	var fullScreenButton = new Ext.Button({
		id: "fullScreenButton",
		tooltip: "Toggle Full Screen",
		iconCls: "gxp-icon-zoomtoextent",
		iconAlign: "right",
		enableToggle: true,
		handler: function () {
			if (Ext.getCmp("fullScreenButton").pressed == true) {
				for (var i=0; i<togglePanels.length; ++i) {
					var cmp = Ext.getCmp(togglePanels[i].id);
					togglePanels[i].collapsed = cmp.collapsed;
					cmp.collapse()
				}
			}
			if (Ext.getCmp("fullScreenButton").pressed == false) {
				for (var i=0; i<togglePanels.length; ++i) {
					if (!togglePanels[i].collapsed) {
						Ext.getCmp(togglePanels[i].id).expand();
					}
				}
			}
		}
	});

	var layersButton = new Ext.Button({
		id: "layersButton",
		tooltip: "Show Layer Switcher",
		iconCls: "layer-switcher",
		handler: function () {
			Ext.getCmp('toolTabPanel').setActiveTab('layersPanel');
			Ext.getCmp('toolPanel').expand();
		}
	});
	
	// toolbar - disabled 
	var toolbar = [panZoom, "-", layersButton, "-", fullScreenButton]

	mapPanel = new GeoExt.MapPanel({
		map: map,
		//tbar: toolbar,
		collapsible: false,
		frame: false,
		region: 'center',
		items: [zoomSlider]
	});

	var treeConfig = [{
		text: "<b>&nbsp;Overlays</b>",
		expanded: true,
		singleClickExpand: true,
		children: [{
			nodeType: "gx_layer",
			layer: heatmap,
			listeners: {
				click: function () {
					opacitySlider.setLayer(this.layer);
				}
			}
		}]
		},{
		text: "<b>&nbsp;Base Layer</b>",
		expanded: true,
		singleClickExpand: true,
		children: [{
			nodeType: "gx_layer",
			layer: layer,
			listeners: {
				click: function () {
					opacitySlider.setLayer(this.layer);
				}
			}
		},{
			nodeType: "gx_layer",
			layer: openStreetMap,
			listeners: {
				click: function () {
					opacitySlider.setLayer(this.layer);
				}
			}
		}]
	}];

	var tree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			applyLoader: false
		}),
		root: {
			nodeType: "async",
			children: treeConfig
		},
		border: false,
		rootVisible: false,
		enableDD: false
	});

	var opacitySlider = new GeoExt.LayerOpacitySlider({
		aggressive: true,
		width: 150,
		isFormField: true,
		inverse: true,
		plugins: new GeoExt.LayerOpacitySliderTip({
			template: "<div>Transparency: {opacity}%</div>"
		})
	});

	var layersPanel = new Ext.Panel({
		title: "Layers",
		id: "layersPanel",
		iconCls: "layer-switcher",
		region: "center",
		items: [tree],
		deferredRender: false,
		bbar: ["Transparency:&nbsp;&nbsp;", opacitySlider]
	});

	var contentsPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		frame: false,
		defaults: {
			collapseMode: "mini",
			frame: false
		},
		items: [{
			xtype:'panel',
			title:'Toolbox',
			id: 'toolPanel',
			layout: 'fit',
			tools: [{type: 'minimize', handler: function () {Ext.getCmp('toolPanel').collapse();}}],
			frame: false,
			split: true,
			html:'Contents of Toolbox panel',
			region: 'east',
			collapseMode: "mini",
			items: [
			        {
			        	xtype: "tabpanel",
			        	id: 'toolTabPanel',
			        	plain: true,
			        	activeTab: 0,
			        	deferredRender: false,
			        	defaults: {
			        		bodyStyle: "padding:10px"
			        	},
			        	items: [layersPanel]
			        }
			        ],
			        width: 300,
			        collapsed: true
		},
		mapPanel
		,{
			xtype:'panel',
			id: 'statusPanel',
			frame: false,
			items: [new Ext.slider.SingleSlider({
			    width: 200,
			    value: 50,
			    increment: 10,
			    minValue: 0,
			    maxValue: 100
			})],
			collapsible: false,
			region: 'south'
		},{
			xtype:'panel',
			id: 'headerPanel',
			frame: true,
			html:"<div id='header'>Suburban Heat</div>",
			collapsible: false,
			region: 'north'
		}]
	});
	
	var panel = new Ext.Panel({
		layout: 'border',
		frame: true,
		width: $('#contents').width(),
		height: $('#contents').height(),
		renderTo: 'panel',
		items: [contentsPanel]
	});

	// set map
	map.setCenter(new OpenLayers.LonLat(138, -34));
	map.zoomTo(4);
	
	heatmap.setDataSet(transformedTestData);
	
	
	//---
	// jQuery event handling and magic below
	//---
	
	var contents$ = $('#contents');
	
	// handle window resize events
	$(window).resize(function() {
		console.log(contents$.width() + "x" + contents$.height())
		panel.setSize(contents$.width(), contents$.height());
	});
}); 
