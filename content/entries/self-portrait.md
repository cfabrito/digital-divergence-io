+++
date = '2026-01-25T15:25:51+01:00'
draft = false
title = 'self-portrait'
+++

### Iterative algorithmic frame approximation with simple geometry

An audiovisual piece exploring iterative approximation as a form of self-portraiture, inspired by Buddhist concepts of impermanence and non-self, particularly the notion of kalāpas, transient, composite units of phenomena, reflected here in the construction of images from ephemeral geometric primitives.

{{< video
  src="./videos/self-portrait/self-portrait.mp4" ratio="9/16"
>}}

The work uses a Python-based greedy optimization process to approximate each video frame. For each target frame, the algorithm iteratively adds white rectangles with randomized position, scale, and opacity, evaluating each candidate by its reduction in mean squared error (MSE) against the target image.

At each iteration, the shape that produces the greatest improvement is selected, gradually building up a coarse reconstruction of the frame through accumulated primitives.
The video is exactly that progression.

The final project was was rendered in TouchDesigner and linked to Ableton Live, allowing synthesizer parameters to be modulated directly by the progression of reconstruction error. As the image converges, the audio translates visual mismatch into a gritty evolving sonic texture.

Made for the GENUARY 2026.
