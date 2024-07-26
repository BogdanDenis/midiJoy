# midiJoy

An Electron application to map MIDI controllers to vJoy virtual joystick devices.
Typical Xbox controllers have a limited number of axes (2 sticks, triggers) but in some videogames it would be very convenient to have more physical axis controls.
For example, in flight simulators, one may use this to map throttle, RPM or mixture controls to knobs/sliders on MIDI devices.
midiJoy will read inputs from a MIDI device and update vJoy device axes.

## Requirements
- Windows
- [vJoy](https://github.com/shauleiz/vJoy?tab=readme-ov-file) installed

## Installation
You can find installers for all versions in [Releases](https://github.com/BogdanDenis/midiJoy/releases)

## Planned features
- Mapping multiple MIDI devices at the same time
- Viewing vJoy devices axes values (for now you can use [JoystickGremlin](https://github.com/WhiteMagic/JoystickGremlin)'s Input Viewer to verify that vJoy device axes change with MIDI input)