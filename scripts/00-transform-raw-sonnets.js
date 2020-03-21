const fs = require("fs");
const path = require("path");

const sonnets = [];
fs.readFileSync(path.resolve(__dirname, "./../data/raw-sonnets.txt"))
	.toString()
	.split("\n")
	.filter(line => line)
	.forEach(line => {
		if (line.trim().split(" ").length === 1) {
			sonnets.push([]);
		} else {
			sonnets[sonnets.length - 1].push(line.trim());
		}
	});
fs.writeFileSync(
	path.resolve(__dirname, "./../data/sonnets.json"),
	JSON.stringify(sonnets, null, 2)
);
