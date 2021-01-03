# -*- coding: utf-8 -*-

import json
from crawler.index_generator import IndexGenerator, SyllabusIndexEntry
from pathlib import Path

__author__ = "Blake Vente"
__copyright__ = "Blake Vente"
__license__ = "mit"

INDEX = Path("index.json.orig")


def test_index_generator():
    index_generator = IndexGenerator(INDEX)
    index = index_generator.generate_index()
    assert len(index) > 0
    first = index[0]
    attrs_in_record = {"course_id", "tags", "urls"}
    assert "course_id" in first
    assert set(first).issuperset(attrs_in_record)
    with open("processed_index.json.orig", "w") as outfile:
        json.dump(index, outfile, indent=4)


def test_syllabus_index_entry():
    course_id = "CS_127"
    syllabus_text = "Python Python Python https://google.com/"
    syllabus_properties = (
        SyllabusIndexEntry(course_id, syllabus_text)
        .extract_urls()
        .extract_tags()
        .to_dict()
    )
    assert set(syllabus_properties).issuperset(
        {"course_id", "tags", "urls", "uuid", "syllabus"}
    )
