"""
TODO: 
- [DONE] For all Artists that do not have a value under "Country", fill it with "Unknown"
- [DONE] Same as above for Authors
- [DONE] In quotes.csv, it gives the author AND their work in one attribute, in the format "Author, Work". I think we should just 
    delete everything after and including the comma. We don't care about what book this comes from, just who wrote it.
- In artist_info, some artists are clearly duplicated. Need to somehow collapse them
    [ex: "Chris Brown,United States,2624857" is repeated 5 times on lines 75-79]
    - What's tricky about this is that sometimes it's clearly the same artist, but they are in different countries
        [ex: "John Williams" with a fan_count of 1203493 appears a few times in dif countries in lines 518-524]
- Do we really need the 'category' attribute for each quote? Esp. if we're getting the VAD from the quote itself (see below)

        
Processing we need to do in SQL:
- Get avg valence/arousal/dominance for each artist by JOINing with Song and GROUP BYing and then using avg(valence/arous/dom)
- Get val/aro/dom for every quote by splitting each quote into words [can be a python thing], getting the VAD of each word, and taking the avg (or something) 


Harder things:
- Are we going to just JOIN between Song and Artist by artist name alone? Because we'll run into the problem of multiple artists w/ same name

"""


import numpy as np
import pandas as pd
import csv

artist_path = "./datasets/artist_info.csv"
author_path = "./datasets/author_info.csv"
muse_path = "./datasets/muse_songs.csv"
quotes_path = "./datasets/quotes.csv"
word_vad_path = "./datasets/word_to_vad.csv"

with open(quotes_path, "r") as source:
    reader = csv.reader(source)
    
    # head = next(reader)
    # print([(i, head[i]) for i in range(len(head))])
      
    with open("./datasets/output.csv", "w") as result:
        writer = csv.writer(result)
        for r in reader:
            row = [r[0], r[1]]
            
            
            writer.writerow(tuple(row))




# 1, 3, 7
