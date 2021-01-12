# -*- coding: utf-8 -*-
"""
Open PDF file contents into directories
"""

import logging
import hashlib

from pathlib import Path
import re
from string import digits
from typing import Dict, Generator, List, Text, Tuple
import json
from rake_nltk import Rake
from dataclasses import asdict, dataclass, field

from rake_nltk.rake import Metric
from nltk.tokenize import word_tokenize
from nltk import corpus


__author__ = "Blake Vente"
__copyright__ = "Blake Vente"
__license__ = "mit"

_logger = logging.getLogger(__name__)

SYLLAB_STOPWORDS = [
    "csci", "sexual", "harassment", "cheating", "resources", "see", "edition",
    "violence", "please", "call", "thank you", "honesty", "visitors", "pm",
    "and", "consent", "services", "topics", "include", "blackboard", "including",
    "religious", "dishonesty", "unfair", "advantage", "floor", "or", "must",
    "offenses", "strongly", "suggest", "week", "special",
] 

@dataclass
class SyllabusIndexEntry:
    """
    one record defining a syllabus
    implements method chaining
    """

    course_id: str = ""
    syllabus: Text = ""
    uuid: int = 0
    tags: List[Text] = field(default_factory=list)
    urls: List[Text] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.uuid = hashlib.sha1(self.syllabus.encode('utf-8')).hexdigest()

    def extract_tags(self):
        # remove urls, remove digits, tokenize words
        url_less = re.sub(r"http\S+", "", self.syllabus)
        remove_digits = str.maketrans("", "", digits)
        digit_less = url_less.translate(remove_digits)
        syllabus_tokenized = " ".join(word_tokenize(digit_less))
        stopwords = corpus.stopwords.words("english")
        stopwords.extend(SYLLAB_STOPWORDS)

        # get rake-nltk keyword extractor
        tag_extractor = Rake(
            stopwords=stopwords,
            max_length=2,
            ranking_metric=Metric.DEGREE_TO_FREQUENCY_RATIO,
        )
        tag_extractor.extract_keywords_from_text(syllabus_tokenized)
        # TODO: Only add word tags if they are actually english words
        #       and also pass through a denylist
        self.tags.extend(tag_extractor.get_ranked_phrases()[:20])
        return self

    def extract_urls(self):
        newline_less = re.sub(r"\n", "", self.syllabus)
        self.urls.extend(re.findall(r"(https?://\S+)", newline_less))
        return self

    def to_dict(self) -> Dict:
        return asdict(self)


class IndexGenerator:
    def __init__(self, json_index: Path) -> None:
        try:
            with open(json_index, "r") as infile:
                self._course_to_syllabi: Dict = json.load(infile)
        except FileNotFoundError as e:
            _logger.info(e)
            _logger.critical(f"Cannot generate index for file {json_index}.")
            raise FileNotFoundError

    def generate_index(self) -> List[Dict]:
        return list(
            map(
                lambda crs_syllab_pair: SyllabusIndexEntry(*crs_syllab_pair)
                .extract_tags()
                .extract_urls()
                .to_dict(),
                self.syllabus_visitor(),
            )
        )

    def syllabus_visitor(self) -> Generator[Tuple[str, Text], None, None]:
        for course_id, syllabi_text in self._course_to_syllabi.items():
            for syllabus_text in syllabi_text:
                yield course_id, syllabus_text
