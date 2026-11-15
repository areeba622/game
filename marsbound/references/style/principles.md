### Design principles and implementation

## Color direction
Build compact color ramps for each biome, material, character, and spell school, reserving the clearest contrasts for party members, interactable objects, health, and status. In a daisyUI theme, use the party or interaction highlight for `primary`, a spell-school or biome counter-color for `secondary`, and assign three exact dark menu-panel swatches to `base-100`, `base-200`, and `base-300`.

## Imagery direction
Use chibi or small-proportion character sprites, repeatable terrain tiles, monsters, item icons, portraits, and spell effects drawn at one coherent pixel density and perspective.

## Content density
Support medium scene density and high menu density, but preserve walkable routes, targets, selections, and party state as instantly distinguishable pixel clusters. Use the `*-sm` size variants for daisyUI components to preserve this compact working density.

## Motion direction
Use authored walk cycles, battle anticipation and impact frames, stepped damage numbers, palette flashes, spell bursts, and short victory poses.

## Shape language
Construct environments from repeatable square tiles and frame menus with pixel corners, inset borders, inventory slots, health bars, and small heraldic ornaments. In daisyUI themes, set the `--radius-*` variables to `0` or `0.25rem`.

## Typography rules
Render a highly legible bitmap face at integer scale, give dialogue generous line height, and reserve compact capitals for commands, stats, and item abbreviations.