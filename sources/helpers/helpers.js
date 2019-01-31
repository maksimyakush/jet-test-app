export const cutString = (str, strLength) => {
	if (!str) return "Unknown";
	return str.length > strLength ? `${str.slice(0, strLength-3)}...` : str;
};
