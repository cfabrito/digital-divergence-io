+++
date = '2025-05-11T15:25:51+01:00'
draft = false
title = 'Augmented Acrobatics'
+++

### A Projection Mapping System Driven by Performer Motion

This project explores projection mapping as a way to extend a live acrobatics performance, allowing the performer’s motion to generate light that remains spatially aligned with the body in real time.

The core intention was to create a light-tracking effect in which the performer’s shape and motion are captured and re-projected onto the body, producing a tight coupling between physical movement and projected imagery.

To achieve accurate alignment, the system requires estimating the relative pose between the depth camera and the projector, as well as the projector’s intrinsic parameters.
A calibration procedure was implemented using Python and OpenCV. It involves projecting a known pattern into the scene at multiple depths and capturing the result with the camera. From the point correspondences between the projected and captured images, the camera’s position and orientation relative to the projector are reconstructed, allowing a projection matrix to be computed that aligns camera space with projected space.

Building on this alignment, a trail effect was implemented in which a sequence of past depth captures is projected simultaneously. This creates a set of moving sillouetes that complemented the performance by allowing the audience to look simultaneously at present and past motion.



{{< video
  src="./videos/sandbox/sandbox.mp4"
  width="600"
>}}

The installation was conceived with no concrete goal and no correct way to engage. Instead, it offers an open-ended environment for contemplative play, encouraging participants to reconnect with their bodies and the present moment, and to experience awareness through movement and visual feedback, rather than intention.

sandbox was developed alongside Augmented Acrobatics, adapting the same camera–projector alignment system for audience-driven interaction.


