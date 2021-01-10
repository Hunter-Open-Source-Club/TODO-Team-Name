"""
    Searcher Class


"""

import meilisearch
import json

from typing import List, Dict, Text, Set
from dataclasses import field

from time import sleep

class Searcher:

    client = None
    indexes: Set[Text] = field(default_factory=set)


    def __init__(self):
        self.client = meilisearch.Client('http://127.0.0.1:7700')


    def add_syllabus(self, index_name: Text, json_path):
        # TODO: REPLACE WITH BACKEND REQUEST
        try:
            json_file = open(json_path)
            json_data = json.load(json_file)
        except Exception:
            raise ValueError('Unable to read json file')
         
        try:
            index = self.client.create_index(uid=index_name) 
        except meilisearch.errors.MeiliSearchApiError:
            index = self.client.get_index(uid=index_name)
        
        index.add_documents(json_data)


    def search(self, index_name: Text, term):
        try:
            index = self.client.get_index(uid=index_name)
        except:
            raise ValueError('\'%s\' index does not exist.' %index_name)
        
        class_results = index.search(term)['hits']
        print(len(class_results))
        res = []
        for course in class_results:
            # res.append({'course_id': course['course_id'], 'tags': course['tags']})
            res.append({'course_id': course['course_id']})

        return res


index = 'CS'
term = 'artificial'
json_file = 'processed_index.json.orig'

searcher = Searcher()

# indexes = [course['uid'] for course in searcher.client.get_indexes()]
# for i in indexes:
#     if i != index:
#         searcher.client.index(i).delete()

searcher.add_syllabus(index, json_file)

# sleep(1)

query_results = searcher.search(index,term)
print(query_results)


# print(json.dumps(json_data, indent = 2))
