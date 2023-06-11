# Prodia Plugin

## Description

Easily generate images from Atlas.

## Usage

Make sure the plugin is enabled for the selected conversation.

You can call the plugin directly by using default command `!prodia`
or you can simply ask the chat to generate an image.

See examples below.

## Supported Settings

- Model:

  - Analog Diffusion v1.0
  - Anything v3.0
  - Anything v4.5
  - Anything V5
  - Orange Mix AOM3A3
  - Deliberate v2
  - Dreamlike Diffusion 1.0
  - Dreamlike Diffusion 2.0
  - Dreamshaper 5 BakedVae
  - Dreamshaper 6 BakedVae
  - Elddreths Vivid Mix
  - Lyriel v15
  - Lyriel v16
  - Meinamix MeinaV9
  - Openjourney V4
  - Portrait+ 1.0
  - Realistic Vision V1.4
  - Realistic Vision V2.0
  - Rev Animated v122
  - SDV1 4
  - Pruned Emaonly v1-5
  - Shonins Beautiful v10
  - Theallys Mix II Churned
  - Timeless 1.0

- Aspect Ratio:

  - square
  - portrait
  - landscape

- Samplers:

  - DDIM
  - Heun
  - Euler
  - Euler a
  - DPM++ 2M Karras

- CFG Scale
- Steps

## Examples

#### Basic Example

```
generate a super realistic image of cat riding a surfboard
```

![a cat riding a surfboard](https://images.prodia.xyz/04019d68-a5cb-4fba-8ff6-6b982038df14.png)

#### Example 1:

```
!prodia with 2m karras. landscape ratio. 100 steps. cfg 16. a wholesome animation key shot of brooklyn new york, medium shot, studio ghibli, pixar and disney animation, 3 d, sharp, rendered in unreal engine 5, anime key art by greg rutkowski, bloom, dramatic lighting
```

![a wholesome animation key shot of brooklyn new york, medium shot, studio ghibli, pixar and disney animation, 3 d, sharp, rendered in unreal engine 5, anime key art by greg rutkowski, bloom, dramatic lighting](https://images.prodia.xyz/5a91ff05-8390-480a-b3cb-c26d291d8985.png)
Supported Models:

#### Example 2:

```
!prodia with 2m karras. portrait ratio. 100 steps. cfg 16. epic realistic,bright sunny day, daylight on mars, mars, outside,bright sky, (((sexy spacesuit, havey boots, sexy woman, see-through helmet, straps, belts, black jeans, full body, zoomed out, detailed costume, utility belt))) long slender legs 80mm, sexy woman wearing an astronaut helmet. (((winona ryder,sci-fi, science fiction, spacex fashion, beautiful face))) ((pretty face)),mars background daylight, (((full body, athletic body, action pose, sexy detailed spacesuit, slender long legs))) dusty atmosphere, fog john singer sarget, blue pallette, mars background, (hyperrealism, soft light, sharp:1.2), soft light, sharp, (cinematic, teal and orange:0.85), (muted colors, dim colors, soothing tones:1.3), low saturation, (hyperdetailed:1.2), (intricate details:1.12), hdr, (intricate details, hyperdetailed:1.15), faded, (neutral colors:1.2), art, (hdr:1.5), (muted colors:1.1), (pastel:0.2), hyperdetailed, (artstation:1.4), warm lights, dramatic light, (intricate details:1.2), vignette, natural background, rutkowski
```

![with 2m karras. portrait ratio. 100 steps. cfg 16. epic realistic,bright sunny day, daylight on mars, mars, outside,bright sky, (((sexy spacesuit, havey boots, sexy woman, see-through helmet, straps, belts, black jeans, full body, zoomed out, detailed costume, utility belt))) long slender legs 80mm, sexy woman wearing an astronaut helmet. (((winona ryder,sci-fi, science fiction, spacex fashion, beautiful face))) ((pretty face)),mars background daylight, (((full body, athletic body, action pose, sexy detailed spacesuit, slender long legs))) dusty atmosphere, fog john singer sarget, blue pallette, mars background, (hyperrealism, soft light, sharp:1.2), soft light, sharp, (cinematic, teal and orange:0.85), (muted colors, dim colors, soothing tones:1.3), low saturation, (hyperdetailed:1.2), (intricate details:1.12), hdr, (intricate details, hyperdetailed:1.15), faded, (neutral colors:1.2), art, (hdr:1.5), (muted colors:1.1), (pastel:0.2), hyperdetailed, (artstation:1.4), warm lights, dramatic light, (intricate details:1.2), vignette, natural background, rutkowski](https://images.prodia.xyz/b10e1206-334c-46dd-adfe-620efc5548db.png)

#### Example 3:

```
!prodia with lyriel v6 model. 50 steps. portrait ratio. photo of a business man looking at the camera with short curly hair and super detailed brown eyes has a pretty sun shining through in the background, light brown and fight amber, close-up intensity, shadow play, photo taken with a professional camera
```

![photo of a business man looking at the camera with short curly hair and super detailed brown eyes has a pretty sun shining through in the background, light brown and fight amber, close-up intensity, shadow play, photo taken with a professional camera](https://images.prodia.xyz/b37639ab-daef-46ff-b78d-754ea14fe70e.png)

#### Example 4:

```
!prodia with lyriel v16 model. 100 steps. cfg 16. Cyberwarfare, Soldiers are now trained in virtual reality simulated environments for maximum experience and efficiency. It's terrifying, but perfectly safe, until a virus is planted in the software, and the soldiers become trapped inside the simulated environments. Safety goes out the window when the simulated threats become real and start attacking them. a cursed prince turns into a beast, Nikon D3500 DSLR Camera, Mystifying, sitting, Nebula, Mask, robert capa, Plain, Future Circular Collider, Thermal vision, backgrounds_multiple_colors, beautiful island lagoon, fairy tale fantasy, alfred stieglitz, var-cinematic-fx, var-lens-type, var-lighting-source, var-photofilm-color, science fiction social science fiction, , photorealistic, hyperrealistic, Hasselblad X1D - 50c, Cinematic, Blur Effect, Long Exposure, 8K, Ultra-HD, Natural Lighting, Moody Lighting, Cinematic Lighting, hyper-realistic, vibrant, 8k, detailed, ultra detail, sci-fi, shiny hair, overcast, lots of fine detail in the style of 'pursuit' by gesaffelstein, photorealistic, cinematic lighting, light atmosphere, volumetric lighting, action pose, epic scene, lots of fine detail, movie style, photography, natural textures, natural light, natural blur, photorealism, cinematic rendering, ray tracing, highest quality, highest detail, Cinematic, Blur Effect, Long Exposure, 8K, Ultra-HD, Natural Lighting, Moody bright Lighting, Cinematic Lighting, hyper-realistic, vibrant, detailed, ultra detail, RAW photo, day time, (high detailed skin:1.2), 8k uhd, dslr, soft lighting.
```

![with lyriel v16 model. 100 steps. cfg 16. Cyberwarfare, Soldiers are now trained in virtual reality simulated environments for maximum experience and efficiency. It's terrifying, but perfectly safe, until a virus is planted in the software, and the soldiers become trapped inside the simulated environments. Safety goes out the window when the simulated threats become real and start attacking them. a cursed prince turns into a beast, Nikon D3500 DSLR Camera, Mystifying, sitting, Nebula, Mask, robert capa, Plain, Future Circular Collider, Thermal vision, backgrounds_multiple_colors, beautiful island lagoon, fairy tale fantasy, alfred stieglitz, var-cinematic-fx, var-lens-type, var-lighting-source, var-photofilm-color, science fiction social science fiction, , photorealistic, hyperrealistic, Hasselblad X1D - 50c, Cinematic, Blur Effect, Long Exposure, 8K, Ultra-HD, Natural Lighting, Moody Lighting, Cinematic Lighting, hyper-realistic, vibrant, 8k, detailed, ultra detail, sci-fi, shiny hair, overcast, lots of fine detail in the style of 'pursuit' by gesaffelstein, photorealistic, cinematic lighting, light atmosphere, volumetric lighting, action pose, epic scene, lots of fine detail, movie style, photography, natural textures, natural light, natural blur, photorealism, cinematic rendering, ray tracing, highest quality, highest detail, Cinematic, Blur Effect, Long Exposure, 8K, Ultra-HD, Natural Lighting, Moody bright Lighting, Cinematic Lighting, hyper-realistic, vibrant, detailed, ultra detail, RAW photo, day time, (high detailed skin:1.2), 8k uhd, dslr, soft lighting.](https://images.prodia.xyz/70f552fc-59ac-4398-9d8c-cc2675d22f47.png)
