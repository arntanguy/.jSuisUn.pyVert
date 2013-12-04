{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "scene.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 4,
	"geometries"    : 2,
	"materials"     : 2,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Plane" : {
		"geometry"  : "geo_Plane.002",
		"groups"    : [  ],
		"material"  : "Material.004",
		"position"  : [ -3.79895, -1.16511, -0.0210904 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 6.43443, 6.43443, 6.43443 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : true,
		"doubleSided"   : false,
                "physicsShape"  : "BoxMesh",
		"physicsMass"   : 0.0
	},

	"Cube" : {
		"geometry"  : "geo_Cube.003",
		"groups"    : [  ],
		"material"  : "Material.003",
		"position"  : [ 0.000573635, -6.74134e-09, 0.196951 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : true,
		"receiveShadow" : false,
		"doubleSided"   : false,
                "physicsShape"  : "BoxMesh",
		"physicsMass"   : 0.0
	},

	"Sun" : {
		"type"       : "AmbientLight",
		"position"   : [ 6.60006, 5.91994, 8.01279 ],
		"rotation"   : [ -1.83964e-08, -3.99724e-08, 0.862654 ],
		"color"      : 16777215,
		"distance"   : 25.000,
		"intensity"  : 1.000
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
	"geo_Plane.002" : {
		"type" : "ascii",
		"url"  : "scene.Plane.002.js"
	},

	"geo_Cube.003" : {
		"type" : "ascii",
		"url"  : "scene.Cube.003.js"
	}
},


"materials" :
{
	"Material.003" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 7995811, "ambient": 7995811, "opacity": 1, "blending": "NormalBlending" }
	},

	"Material.004" : {
		"type": "MeshPhongMaterial",
		"parameters": { "color": 3449600, "ambient": 3449600, "opacity": 1, "ambient": 3449600, "specular": 8355711, "shininess": 5e+01, "blending": "NormalBlending" }
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
