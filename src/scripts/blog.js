const sortPostsByDateMostRecentFirst = function(pa, pb) {
    var a = pa.data.pubDate.getTime();
	var b = pb.data.pubDate.getTime();

	if(a > b) return  -1;
	if(a === b) return 0;
	return 1;

}

export { sortPostsByDateMostRecentFirst };