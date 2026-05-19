+++
date = '2025-11-05T15:44:13+01:00'
draft = false
title = 'bright stones'
+++

## A Projection Mapping System for Stone Architecture
#### S.A. Bar Galeria | Ponte de Lima | Portugal
Over three collaborative musical performances at S.A. Bar Galeria, I developed and iterated on a controllable generative visual system, exploring new techniques and combinations with each edition, in particular projection mapping on the space itself.

The stage and dancefloor at S.A. Bar Galeria are framed by a traditional rustic stone wall with highly visible individual elements. Rather than treating the wall as a neutral projection surface, my goal was to bring it to life, using light and motion to emphasize depth and rhythm, aiming for an augmented spatial experience that blured the boundary between the physical space and projected images.

The stone wall was 3D scanned using Polycam, generating a detailed mesh of the surface geometry.

{{< video
  src="./videos/bright-stones/wall_3d.mp4"
  width="600"
>}}

During the performance's setup, this model was aligned in TouchDesigner using CamSchnappr.

Having this new layer, unlocked interesting interactions with the existing generative system, for instance, keeping the architectural mesh continuously present and introducing effects in a subtractive manner, allowing form to emerge through shadow.

{{< youtube id=H6LkITkq14k class="vertical-youtube" >}}

For the third performance, the system was extended to enable individual control of each stone. The wall’s UV map was remapped into a grayscale-coded representation, in which each stone occupies a unique luminance value, effectively turning the physical surface into a set of addressable elements.

Using a histogram-based technique, arbitrary images or generative patterns could then be used to drive the activation of individual stones, allowing complex spatial animations to emerge from arbitrary source imagery.

{{< video
  src="./videos/bright-stones/stones_activation_circ.mp4"
  width="600"
>}}

{{< video
  src="./videos/bright-stones/stones_activation_fluids.mp4"
  width="600"
>}}

{{< youtube id=7cUIrFfu4qQ class=vertical-youtube >}}

This approach is applicable to structures with similar topologies and can be adapted to architectural façades, ruins, and historical sites. The system can also be extended with cameras or other sensors to introduce interactivity, enabling architectural elements to respond directly to the audience and their movement.