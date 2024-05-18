export const directions = [
	"East",
	"South-east",
	"South",
	"South-west",
	"West",
	"North-west",
	"North",
	"North-east",
];

export function direction_to_text(direction = 0) {
	return directions[direction % 8];
};
