//---
//Map
//---

Ext.onReady(function() {

	var pureCoverage = false;
    //	pink tile avoidance
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    //	make OL compute scale according to WMS spec
	OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

	var format = 'image/png';

	var bounds = new OpenLayers.Bounds(
			133.212999701183, -38.0626948581456,
			140.973354941166, -28.9710283436566
	);
	var options = {
			controls : [ new OpenLayers.Control.PanPanel(),
			             new OpenLayers.Control.ZoomPanel(),
			             new OpenLayers.Control.ScaleLine(),
			             new OpenLayers.Control.Attribution(),
			             new OpenLayers.Control.KeyboardDefaults() ],
//			maxExtent: bounds,
//			maxResolution: 0.0355143223222226,
			projection: "EPSG:4326",
			units: 'degrees'
	};
	map = new OpenLayers.Map(options);


//	var blueMarble = new OpenLayers.Layer.WMS("Blue Marble - Global Imagery",
//	"http://maps.opengeo.org/geowebcache/service/wms", {
//	layers : "bluemarble", 
//	transparent: true
//	}, {
//	wrapDateLine : true,
//	transitionEffect : 'resize',
//	opacity: 0.2
//	});

	var openStreetMap = new OpenLayers.Layer.WMS( "OSGEO Base Map",
			"http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'}, {wrapDateLine: true, transitionEffect: 'resize'} );


        
	var pop2010HeatMap = new OpenLayers.Layer.WMS(
			"2010 Population Heat Map",
			"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
			{
				LAYERS: 'govhack:lga_pop_2010_heatmap',
				STYLES: '',
				format: format,
				transparent: true
			},
			{
				buffer: 1,
				isBaseLayer: false,
				yx : {'EPSG:4326' : true}, 
				transitionEffect: 'resize',
				singleTile: true
			} );
        
	var pop2010LGA = new OpenLayers.Layer.WMS(
			"2010 LGA Shapes",
			"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
			{
				LAYERS: 'govhack:lga_pop_2010_norm',
				STYLES: '',
				format: format,
				transparent: true
			},
			{
				buffer: 1,
				isBaseLayer: false,
				yx : {'EPSG:4326' : true}, 
				transitionEffect: 'resize',
				singleTile: true
			} );
	var pop2010hospheat = new OpenLayers.Layer.WMS(
			"2010 Hospital Heat Map",
			"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
			{
				LAYERS: 'hospital_heatmap_2010',
				STYLES: '',
				format: format,
				transparent: true
			},
			{
				buffer: 1,
				isBaseLayer: false,
				yx : {'EPSG:4326' : true}, 
				transitionEffect: 'resize',
				singleTile: true
			} );
	var pop2015hospheat = new OpenLayers.Layer.WMS(
			"2015 Hospital Heat Map",
			"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
			{
				LAYERS: 'hospital_heatmap_2015',
				STYLES: '',
				format: format,
				transparent: true
			},
			{
				buffer: 1,
				isBaseLayer: false,
				yx : {'EPSG:4326' : true}, 
				transitionEffect: 'resize',
				singleTile: true
			} );
	var pop2020hospheat = new OpenLayers.Layer.WMS(
			"2020 Hospital Heat Map",
			"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
			{
				LAYERS: 'hospital_heatmap_2020',
				STYLES: '',
				format: format,
				transparent: true
			},
			{
				buffer: 1,
				isBaseLayer: false,
				yx : {'EPSG:4326' : true}, 
				transitionEffect: 'resize',
				singleTile: true
			} );
	var pop2025hospheat = new OpenLayers.Layer.WMS(
			"2025 Hospital Heat Map",
			"http://evolvesa.org:8080/geoserver/govhack/wms?service=WMS&version=1.1.0",
			{
				LAYERS: 'hospital_heatmap_2025',
				STYLES: '',
				format: format,
				transparent: true
			},
			{
				buffer: 1,
				isBaseLayer: false,
				yx : {'EPSG:4326' : true}, 
				transitionEffect: 'resize',
				singleTile: true
			} );
        
    // added in z-order
	map.addLayer(openStreetMap);
	map.addLayer(pop2010LGA);
	map.addLayer(pop2010HeatMap);
	map.addLayer(pop2010hospheat);
	map.addLayer(pop2015hospheat);
	map.addLayer(pop2020hospheat);
	map.addLayer(pop2025hospheat);

	//	---
	//	Controls
	//	---

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
	var contents$ = $('#map-container');
	var mapPanel = new GeoExt.MapPanel({
		map : map,
		collapsible : false,
		frame : false,
		items : [ zoomSlider ],
		width : contents$.width(),
		height : contents$.height(),
		renderTo : "map-inner"
	});

	//	set map
	map.setCenter(new OpenLayers.LonLat(138, -34));
	map.zoomTo(6);

	//	handle window resize events
	$(window).resize(function() {
		mapPanel.setSize(contents$.width(), contents$.height());
	});
	
});
