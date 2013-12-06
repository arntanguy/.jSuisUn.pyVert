{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "game_scene.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 4,
	"geometries"    : 1,
	"materials"     : 1,
	"textures"      : 1
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Plane" : {
		"geometry"  : "geo_Plane",
		"groups"    : [  ],
		"material"  : "Ground",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ -7.99234, -7.99234, -7.99234 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false,
                "physicsShape"  : "BoxMesh",
		"physicsMass"   : 0.0
	},

	"Sun" : {
		"type"       : "AmbientLight",
		"position"   : [ -3.80664, 6.25931, -0.90329 ],
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
		"position": [ 7.48113, 5.34367, 6.50764 ],
		"target"  : [ 0, 0, 0 ]
	}
},


"geometries" :
{
	"geo_Plane" : {
		"type" : "embedded",
		"id"  : "emb_Plane"
	}
},


"textures" :
{
	"rocks.jpg" : {
		"url": "rocks.jpg",
        "wrap": ["repeat", "repeat"]
	}
},


"materials" :
{
	"Ground" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10717855, "ambient": 10717855, "opacity": 1, "map": "rocks.jpg", "blending": "NormalBlending" }
	}
},


"embeds" :
{
"emb_Plane": {	"scale" : 1.000000,

	"materials" : [	{
		"DbgColor" : 15658734,
		"DbgIndex" : 0,
		"DbgName" : "Ground",
		"blending" : "NormalBlending",
		"colorAmbient" : [0.6400000190734865, 0.5427050671384492, 0.6272300813679408],
		"colorDiffuse" : [0.6400000190734865, 0.5427050671384492, 0.6272300813679408],
		"colorSpecular" : [0.5, 0.5, 0.5],
		"depthTest" : true,
		"depthWrite" : true,
		"mapDiffuse" : "rocks.jpg",
		"mapDiffuseWrap" : ["repeat", "repeat"],
		"shading" : "Lambert",
		"specularCoef" : 50,
		"transparency" : 1.0,
		"transparent" : false,
		"vertexColors" : false
	}],

	"vertices" : [1,-1,0,-1,-1,0,1,1,0,-1,1,0],

	"morphTargets" : [],

	"normals" : [0,0,1],

	"colors" : [],

	"uvs" : [[0.0001,0.0001,0.9999,0.0001,0.9999,0.9999,0.0001,0.9999]],

	"faces" : [43,1,0,2,3,0,0,1,2,3,0,0,0,0],

	"bones" : [],

	"skinIndices" : [],

	"skinWeights" : [],

	"animations" : []
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
