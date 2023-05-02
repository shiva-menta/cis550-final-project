"""
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


import csv
import pandas as pd

# quotes_df = pd.read_csv('./cis550-datasets/quotes.csv')
# words_df = pd.read_csv('./cis550-datasets/word_to_vad.csv')

# # word_set = set(words_df['word'].values)
# word_map = {}
# for _, row in words_df.iterrows():
#     word_map[row[0]] = row[1:]

# filtered_quotes = []
# count = 0
# for quote in quotes_df['quote']:
#     words = re.sub(r"[^a-zA-Z\s]", '', quote.lower().replace('/[\W_]+/g', ' ').replace("'", "")).split()
#     filtered_words = [word for word in words if word in word_set]
#     filtered_quotes.append(' '.join(filtered_words))

#     count += 1
#     if count % 10000 == 0:
#         print(count)
#         print(words)

# filtered_quotes_df = pd.DataFrame({'quote': filtered_quotes})

# averages = []
# count = 1


# with open('./cis550-datasets/quotes.csv') as quotes:
#     reader = csv.reader(quotes)

#     with open("./cis550-datasets/results.csv", 'w') as result:
#         fnames = ['quote','author_name_display','author_name_normal','category', 'valence_avg', 'arousal_avg', 'dominance_avg']
#         writer = csv.writer(result)
                
#         field = True
#         for row in reader:
#             # print(row)
#             if field:
#                 field = False
#             else:
#                 quo = row[0]
#                 quote_split = re.sub(r"[^a-zA-Z\s]", '', quo.lower().replace("\"", "").replace('/[\W_]+/g', ' ').replace("'", "")).split()
                
#                 # print(count, quo, quote_split)
#                 vad = [0, 0, 0]
#                 num_words = 0
#                 for w in quote_split:
#                     if w in word_map:
#                         num_words += 1
#                         v, a, d = word_map[w]
#                         vad = [vad[0] + v, vad[1] + a, vad[2] + d]
#                 try:
#                     vad_avg = [vad[0] / num_words, vad[1] / num_words, vad[2] / num_words]
#                 except (ZeroDivisionError):
#                     vad_avg = [-1, -1, -1]
#                     # print(quo, quote_split, num_words)
                
#                 writer.writerow(tuple([row[0], row[1], row[2], row[3], vad_avg[0], vad_avg[1], vad_avg[2]]))
                
#                 count += 1
#                 if count % 10000 == 0:
#                     print(count)
#                     print("--", row[0])
#                     print("--", vad_avg)

artist_path = "../cis550-datasets/artist_info.csv"
author_path = "../cis550-datasets/author_info.csv"
muse_path = "../cis550-datasets/muse_songs.csv"
quotes_path = "./cis550-datasets/quotesORIG.csv"
word_vad_path = "../cis550-datasets/word_to_vad.csv"

with open("./cis550-datasets/quotes.csv", 'r') as f:
    reader = csv.reader(f)

    with open("./cis550-datasets/results.csv", "w") as f2:
        writer = csv.writer(f2)
        for r in reader:  
            writer.writerow([*r[:3], *r[4:]])
            







# print(re.sub(r"[^a-zA-Z\s]", '', "Hello,$$ there m'y name is J.K. rool^ing../ trut hta".lower().replace('/[\W_]+/g', ' ').replace("'", "")).split())

# import string
# import re

# def normalize(input):
#     # Remove punctuation and convert to lowercase
#     input = input.replace(".", " ").translate(str.maketrans('', '', string.punctuation)).lower()

#     # Split into words (including periods) and store in a list
#     normalized = re.findall(r'\b[\w.]+\b', input)

#     return " ".join(normalized)



# import numpy as np
# import pandas as pd
# import csv

# artist_path = "../cis550-datasets/artist_info.csv"
# author_path = "../cis550-datasets/author_info.csv"
# muse_path = "../cis550-datasets/muse_songs.csv"
# quotes_path = "./cis550-datasets/quotes.csv"
# word_vad_path = "../cis550-datasets/word_to_vad.csv"

# with open(quotes_path, "r") as source:
#     reader = csv.reader(source)
    
#     # head = next(reader)
#     # print([(i, head[i]) for i in range(len(head))])
      
#     with open("./cis550-datasets/output.csv", "w") as result:
#         writer = csv.writer(result)
#         for r in reader:         
            
#             writer.writerow(tuple([r[0], r[1], r[2]]))


# # with open("../cis550-datasets/output.csv", newline="") as csvfile:
# #     spamreader = csv.DictReader(csvfile, delimiter=",")
# #     sortedlist = sorted(spamreader, key=lambda row:(row['country']), reverse=False)


# # with open("../cis550-datasets/output2.csv", 'w') as f:
# #     fieldnames = ['display_name','normal_name','country','num_listeners']
# #     writer = csv.DictWriter(f, fieldnames=fieldnames)
# #     writer.writeheader()
# #     for row in sortedlist:
# #         writer.writerow(row)




# # 1, 3, 7



