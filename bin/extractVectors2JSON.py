from gensim.models import Word2Vec
import numpy


def extractVectors2JSON(model, filename = "vectors.json", directory = ""):

    #calculate L2 vectors if needed
    if model.wv.vectors_norm == None:
        model.wv.init_sims()

    dic = model.wv.vocab
    to_file = ""
    file_obj = open(directory + filename, "w")
    file_obj.write("{")

    sorted_dic = sorted(dic.items(), key=lambda kv: kv[1].index)
    file_obj.write('"dic":[');

    for elem in sorted_dic:
        word = elem[0]
        file_obj.write(to_file)
        to_file = '"' + word + '",'
    file_obj.write(to_file[:-1])

    file_obj.write("],")

    to_file = "";
    file_obj.write('"vec":[');

    for elem in sorted_dic:
        word = elem[0]
        file_obj.write(to_file)
        attr = model.wv.vocab[word]
        index = attr.index
        norm_vec =  model.wv.vectors_norm[index]
        to_file = numpy.array2string(norm_vec, separator=',').replace('\n', '').replace(' ', '') + ","
    file_obj.write(to_file[:-1])
    file_obj.write("]}")
    file_obj.close()


model = Word2Vec.load("learnings/20190304_153950.model")
extractVectors2JSON(model, directory="learnings/")
