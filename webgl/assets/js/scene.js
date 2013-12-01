{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "scene.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 5,
	"geometries"    : 3,
	"materials"     : 3,
	"textures"      : 1
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Ground" : {
		"geometry"  : "geo_Cube.001",
		"groups"    : [  ],
		"material"  : "Material.003",
		"position"  : [ -0.55329, -4.29008, 0.702181 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 5.64934, 5.84368, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Suzanne" : {
		"geometry"  : "geo_Suzanne",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ -0.800195, 1.77455, 0.408901 ],
		"rotation"  : [ 7.79399e-08, 0, -0 ],
		"quaternion": [ 3.897e-08, 0, 0, 1 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Cube" : {
		"geometry"  : "geo_Cube.002",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ -0.000708103, 2.19846, -1.92366 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Lamp" : {
		"type"       : "PointLight",
		"position"   : [ 4.07625, 5.90386, 1.00545 ],
		"rotation"   : [ 0.650328, 1.86639, 0.0552171 ],
		"color"      : 16777215,
		"distance"   : 30.000,
		"intensity"  : 4.960
	},

	"Camera" : {
		"type"  : "PerspectiveCamera",
		"fov"   : 49.159264,
		"aspect": 1.333000,
		"near"  : 0.100000,
		"far"   : 100.000000,
		"position": [ 7.48113, 5.34367, 6.50764 ],
		"target"  : [ 0, 0, 0 ]
	}
},


"geometries" :
{
	"geo_Cube.001" : {
		"type" : "ascii",
		"url"  : "scene.Cube.001.js"
	},

	"geo_Suzanne" : {
		"type" : "ascii",
		"url"  : "scene.Suzanne.js"
	},

	"geo_Cube.002" : {
		"type" : "ascii",
		"url"  : "scene.Cube.002.js"
	}
},


"textures" :
{
	"negx.jpg" : {
		"url": "negx.jpg",
        "wrap": ["repeat", "repeat"]
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 1256099, "ambient": 1256099, "opacity": 1, "map": "negx.jpg", "blending": "NormalBlending" }
	},

	"Material.001" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10682457, "ambient": 10682457, "opacity": 1, "blending": "NormalBlending" }
	},

	"Material.003" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 8454307, "ambient": 8454307, "opacity": 1, "blending": "NormalBlending" }
	}
},


"transform" :
{
	"position"  : [ 0, 0, 0 ],
	"rotation"  : [ 0, 0, 0 ],
	"scale"     : [ 1, 1, 1 ]
},

"defaults" :
{
	"bgcolor" : [ 0, 0, 0 ],
	"bgalpha" : 1.000000,
	"camera"  : "Camera"
}

}
