{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "scene.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 7,
	"geometries"    : 4,
	"materials"     : 3,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Plane.001" : {
		"geometry"  : "geo_Plane.001",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ 1.21357, -0.428967, 12.0661 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 8.42497, 8.42496, 8.42496 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false,
                "physicsShape"  : "PlaneMesh",
		"physicsMass"   : 0.0
	},

	"Suzanne" : {
		"geometry"  : "geo_Suzanne",
		"groups"    : [  ],
		"material"  : "Material.002",
		"position"  : [ 1.24655, 3.12385, -2.33983 ],
		"rotation"  : [ 7.79399e-08, 0, -0 ],
		"quaternion": [ 3.897e-08, 0, 0, 1 ],
		"scale"     : [ 0.690827, 0.690827, 0.690827 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false,
                "physicsShape"  : "SphereMesh",
		"physicsMass"   : 0.0771484375
	},

	"Plane" : {
		"geometry"  : "geo_Plane",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ 1.21357, 1.23282, -1.80915 ],
		"rotation"  : [ -1.51948, 0, 0 ],
		"quaternion": [ -0.688734, 0, 0, 0.725015 ],
		"scale"     : [ -6.76114, -6.76114, -6.76114 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false,
                "physicsShape"  : "PlaneMesh",
		"physicsMass"   : 0.0
	},

	"Cube" : {
		"geometry"  : "geo_Cube.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 1.92323, 3.46272, -3.34103 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.690827, 0.690827, 0.690827 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false,
                "physicsShape"  : "BoxMesh",
		"physicsMass"   : 0.0
	},

	"Sun" : {
		"type"       : "AmbientLight",
		"position"   : [ -14.3081, 11.4284, -1.52643 ],
		"rotation"   : [ 0, 0, 0 ],
		"color"      : 16777215,
		"distance"   : 25.000,
		"intensity"  : 1.000
	},

	"Lamp" : {
		"type"       : "PointLight",
		"position"   : [ 4.07625, 5.90386, 1.00545 ],
		"rotation"   : [ 0.650328, 1.86639, 0.0552171 ],
		"color"      : 16777215,
		"distance"   : 30.000,
		"intensity"  : 1.000
	},

	"Camera" : {
		"type"  : "PerspectiveCamera",
		"fov"   : 49.159264,
		"aspect": 1.333000,
		"near"  : 0.100000,
		"far"   : 100.000000,
		"position": [ 7.22805, 5.77115, 18.8399 ],
		"target"  : [ 0, 0, 0 ]
	}
},


"geometries" :
{
	"geo_Plane.001" : {
		"type" : "ascii",
		"url"  : "scene.Plane.001.js"
	},

	"geo_Suzanne" : {
		"type" : "ascii",
		"url"  : "scene.Suzanne.js"
	},

	"geo_Plane" : {
		"type" : "ascii",
		"url"  : "scene.Plane.js"
	},

	"geo_Cube.001" : {
		"type" : "ascii",
		"url"  : "scene.Cube.001.js"
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 1418052, "ambient": 1418052, "opacity": 1, "blending": "NormalBlending" }
	},

	"Material.001" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 826019, "ambient": 826019, "opacity": 1, "blending": "NormalBlending" }
	},

	"Material.002" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10682493, "ambient": 10682493, "opacity": 1, "blending": "NormalBlending" }
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
