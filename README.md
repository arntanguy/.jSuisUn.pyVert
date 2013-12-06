.jSuisUn.pyVert
===============

During the night between 2013 December 5th and 6th, the team .jSuisUn.pyVert will compete at the [Nuit de l'info 2013](http://www.nuitdelinfo.com/). This repo contains the result of our whole night.

We tried to make intensive use of WebGL to model a fairground with ducks as the site's layout.

Technologies used:

* HTML5/CSS3/Javascript and WebGL;

* Javascript libraries: dat.gui, physijs, three.js, threex, augmentedgesture.js, imageprocessing.js, PhysicsSceneLoader, stats.js;

* Blender for the 3D conception;

* io_mesh_threejs is a plugin for Blender used in this project, see the tools folder.

Rôle of the folders
===================

docapost and uml-cs contains other stuff hard to (re)use, let's focus on the best part instead.

webgl: contains everything :) Let's check that:

assets: contains resources, only resources.

doc: explanations about the io_mesh_threejs plugin for Blender, also a diff with the required changes to add the CGI logo to the scene.

game: contains the actual game: 

* game.html and game.js run the main game;

* minigame.html and minigame.js is the small game with the duck;

* coincoin.js loads the duck in the scene;

* load_stand.js loads the stand in the scene;

* swap_context.js: As the game is run in a canvas while another application is loaded in another canvas, this file allows to switch which canvas is active.

images: contains mostly textures for now.

libs: contains every libraries used for this project.

sounds: contains a detailed guide about how to catch an alien with a pineapple. No really, there are sound files in there.

tests: contains small demos and proofs of concept to try and toy with WebGL. 

tools: these tools were used for developing purposes and are NOT used at runtime.
