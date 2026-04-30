+++
date = '2026-01-25T15:25:51+01:00'
draft = false
title = 'self-portrait'
+++

### Iterative algorithmic frame approximation with simple geometry

{{< video
  src="./videos/self-portrait/self-portrait.mp4" ratio="9/16"
>}}

An audiovisual piece that explores iterative image approximation.

To achieve this, I created an algorithm in python that minimizes the MSE between video frames and synthetic frames. 
The algorithm is quite simple: at each step it adds white squares with random positions, sizes and opacities and selects one that reduces the error between the current generated image and the target frame. The video is exactly that progression. 

Created with TouchDesigner and Ableton Live.

Made for the GENUARY 2026.
