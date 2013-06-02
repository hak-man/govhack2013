//---
// Map
//---

var map = new OpenLayers.Map({
	controls : [ new OpenLayers.Control.PanPanel(),
			new OpenLayers.Control.ZoomPanel(),
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.Attribution(),
			new OpenLayers.Control.KeyboardDefaults() ]
});

//var blueMarble = new OpenLayers.Layer.WMS("Blue Marble - Global Imagery",
//		"http://maps.opengeo.org/geowebcache/service/wms", {
//			layers : "bluemarble", 
//			transparent: true
//		}, {
//			wrapDateLine : true,
//			transitionEffect : 'resize',
//			opacity: 0.2
//		});

var openStreetMap = new OpenLayers.Layer.WMS( "OSGEO Base Map",
		"http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'}, {wrapDateLine: true, transitionEffect: 'resize'} );

var pop2010HeatMap = new OpenLayers.Layer.WMS(
		"2010 Population Heat Map",
		"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
		{
			layers : 'govhack:lga_pop_2010_heatmap',
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false
			//,
			//wrapDateLine : true
		});


map.addLayer(openStreetMap);
//map.addLayer(blueMarble);
map.addLayer(pop2010HeatMap);

// ---
// Controls
// ---

var zoomSlider = new GeoExt.ZoomSlider({
	map : map,
	aggressive : true,
	vertical : true,
	height : 100,
	plugins : new GeoExt.ZoomSliderTip({
		template : "<div>Zoom Level: {zoom}</div><div>Scale: 1 : {scale}</div>"
	})
});

var panZoom = new GeoExt.Action({
	tooltip : "Pan and zoom around the map",
	iconCls : "gxp-icon-pan",
	toggleGroup : "navigation",
	pressed : true,
	allowDepress : false,
	control : new OpenLayers.Control.Navigation(),
	map : map,
	handler : function() {
		Ext.getCmp("map").body.applyStyles("cursor:default");
		var element = document.getElementById("output");
		element.innerHTML = "";
		layerRuler.removeFeatures(layerRuler.features);
	}
});

var mapPanel = new GeoExt.MapPanel({
	map : map,
	collapsible : false,
	frame : false,
	items : [ zoomSlider ],
	width : $('#contents').width(),
	height : $('#contents').height(),
	renderTo : "mapView"
});

// set map
map.setCenter(new OpenLayers.LonLat(138, -34));
map.zoomTo(3);

var contents$ = $('#contents');

// handle window resize events
$(window).resize(function() {
	mapPanel.setSize(contents$.width(), contents$.height());
});
