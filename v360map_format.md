# here's the format

If it has an ! in front of it, it's not implemented yet. The file can contain 0 events and leave out the event number without problem. If there's not enough bytes in the map for 2 * layers * width * height, then that's a problem. I won't accept either layer amount, width, or height being 0.

* 3 bytes: Magic number. They must be the bytes "0x56 0x03 0x60". See what I did there?
* ! Next byte: Version number. I'm currently on version 1.
* 1 byte: Number of layers. If it goes past 16, you should be suspicious. I don't want any 300 MB map files here.
* 1 byte: Width of layer.
* 1 byte: Height of layer.
* For each tile, 2 bytes. Big endian style.
	* Uses SmileBASIC map tile IDs. (todo: explain more)
* ! Event number: How many events
* ! TODO: event specs.
