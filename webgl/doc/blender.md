# Plugin (Export, Import, Physics)
================================

copy plugin from tools/io_mesh_threejs to
~/.config/blender/2.69/scrips/addons/io_mesh_threejs
Then activate it in Blender user preferences.

# How to use?
==========
## Export
To export scene, select all objects, including cameras and lights, and click on
file->export->three.js

# Physics
=========
Physics properties can be defined from the plugin.
Select a mesh, go to the mesh menu, and at the bottom you'll see a PHYSICS
section under the THREE section. 
Define the physics properties of the object there and you will be able to use
them as-is in THREE :D


## Add properties to physics plugin
===================================
If you lack properties, you can easily integrate them by following the
following steps:

In export_threejs.py:
* Modify the TEMPLATE_OBJECT variable
* Modify the object_string in generate_object

In __init__.py:
* Define your element at the top of the file
Something like 
```
bpy.types.Object.THREE_physicsShape = bpy.props.EnumProperty(
    items = [('BoxMesh', 'BoxMesh', 'Cube-like mesh'),
            ('PlaneMesh', 'PlaneMesh', 'Plane'),
            ('SphereMesh', 'SphereMesh', 'Sphere'),
            ('CylinderMesh', 'CylinderMesh', 'Cylinder'),
            ('ConeMesh', 'ConeMesh', 'Cone'),
            ('CapsuleMesh', 'CapsuleMesh', 'Capsule'),
            ('ConvexMesh', 'ConvexMesh', 'Convex hull of object'),
            ('ConcaveMesh', 'ConcaveMesh', 'Concave'),
            ('HeightfieldMesh', 'HeightfieldMesh', 'matches a regular grid of height values given in the z-coordinatesHeightfield')],
    name = "Mesh Type")
```

* Add it to the OBJECT_PT_physics class

In the engine, add it to PhysicsLoader.js:
* Look for where the Physijs.*Mesh are defined, and do the proper changes,
that's it, you're all set!

