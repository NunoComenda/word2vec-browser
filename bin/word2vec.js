var dic, vec_norm;

/**
 * Desc.  Calculate the set of words most similar to 2 array of words that contribute positively and/or negatively.
 *
 * @param [String] positive   Array containing the words that contribute positively to the resulting set
 * @param [String] negative   Array containing the words that contribute negatively to the resulting set
 * @param int      topn       Number of results needed            .
 * 
 * @return [{string, float}] Vector with word and score (float 0 to 1) with the top words most similar with the input vectors.
 */
function most_similar (positive, negative, topn){
    var word, weight, elem = "";
    var all_words= [], mean= [], vec_n = [], dists, equationVec = [], result, ret = [], ignoredWords = [];
    var veclen = 0.0, indexWord;

    initVectors(positive, all_words,equationVec,1.0);
    initVectors(negative, all_words,equationVec,-1.0);

    for (elem of equationVec) {
        word = elem[0];
        weight = elem[1];
        indexWord = findWordIndex(word);
        if(indexWord > -1){
            vec_n = vec_norm[indexWord]; 
            vec_n = mult_array(vec_n, weight)
            mean.push(vec_n);
        }else{
            ignoredWords.push(word);
        }
    }

    if(vec_n.length == 0){
        /*Error: No words are in dictionary*/
        return;
    }

    mean = meanVector(mean);
    veclen = norm_array(mean);
    mean = math.divide(mean,veclen);

    dists = math.multiply(vec_norm,math.transpose(mean));
    result = getOrderedIndexes(dists, topn + equationVec.length);

    for( elem of result){
        if(!all_words.includes(dic[elem])){
            ret.push([dic[elem], dists[elem]]);
        }
    }

    return ret;
}

/**
 * Desc.  Load the JSON file into 2 gloabal variables
 */
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/vectors.json', true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            db = jQuery.parseJSON(xobj.responseText);
            dic = db["dic"];
            vec_norm = db["vec"];
        }
    };
    xobj.send(null);
}

/**
 * Desc.  Multiplies a vec by a scalar
 */
function mult_array(vec, scalar){
    for(var i=0; i<vec.length; i++) {
        vec[i] *= scalar;
    }
    return vec;
}

/**
 * Desc.  Lenght of the array
 */
function norm_array(vec) {
    var rep = 0.0;
    for(var i=0; i<vec.length; i++) {
        rep += vec[i]*vec[i];
    }
    return Math.sqrt(rep);
}

/**
 * Desc.  Finds a word in the dictionary and returns the index of the word. If the word isn't in the dictionary returns -1
 */
function findWordIndex(word){
    for (var i=0; i < dic.length; i++){
        if(word == dic[i]){
            return i;
        }
    }
    return -1;
}

/**
 * Desc.  Inserts an index in a pivot array of indexes. It's used to keep an ordered list of the similarities of words, it uses another array to lookup to the similarity.
 
 * @param [int]     ret         Array containing the current ordered index array
 * @param [float]   arr         Array containing the lookup values. For instance, if ret = [1,7] we know that arr[1] > arr[7]
 * @param int       index       The new index to be inserted.
 * @param int       maxElements Max length that the ret array can be (it's used to regulate the number of similarity results we want to return)
 * 
 * @return float                Number with the minimum value in the list 
  
 */
function insertIndexArray(ret, arr, index, maxElements){
    var j = 0;
    for (j = 0; ((j < ret.length) && (parseFloat(arr[index]) < parseFloat(arr[ret[j]]))); j++);

    ret.splice(j, 0, index);

    if(ret.length > maxElements){
        ret.pop();
        return arr[ret[maxElements-1]];
    }
    return -10;
}

/**
 * Desc.  Function that analyses an array and returns an ordered array with the indexes of the highest values. The lenght of the array returned is the same lenght as top.
 */

function getOrderedIndexes(arr, top) {
    var ret = [];
    var min = -10;
    var j = 0;

    for (var i = 0; i < arr.length; i++) {
        if(arr[i] > min) {
            min = insertIndexArray(ret, arr, i, top)
        }    
    }
    return ret;
}

/**
 * Desc.  Mean of a matrix, returns a row with the average of every column.
 */
function meanVector(vec) {
    var ret = vec[0];
    for(var i = 1; i< vec.length;i++){
        ret = math.add(ret, vec[i]);
    }
    ret = math.divide(ret, vec.length);
    return ret;
}

/**
 * Desc.  Auxiliary function to initiate vectors.
 */
function initVectors(vec, all_words,equationVec,scalar){
    for (var i=0; i < (vec != null && vec.length); i++){
        all_words.push(vec[i]);
        equationVec.push([vec[i], scalar]);
    }
}
