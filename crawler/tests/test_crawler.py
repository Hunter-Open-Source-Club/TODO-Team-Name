# -*- coding: utf-8 -*-

import json
from crawler.crawl_pdf import PdfCrawler, DirCrawler
from pathlib import Path

__author__ = "Blake Vente"
__copyright__ = "Blake Vente"
__license__ = "mit"

PDF_ROOT_DIR = Path("./_fixtures")
CS_127 = PDF_ROOT_DIR / "CS_127"


def test_pdf_crawler():
    pdf_file = CS_127 / "CS127_ligorio_syllabus_s20.pdf"
    crawler = PdfCrawler()
    assert "python" in crawler.pdf_to_text(pdf_file).lower()


def test_dir_crawler():
    crawler = DirCrawler()
    pdf_contents = crawler.dir_to_pdf_contents(CS_127)
    index = crawler.dir_to_index(PDF_ROOT_DIR)
    assert pdf_contents is not None
    assert len(pdf_contents) > 0
    assert "Python" in pdf_contents[0]
    assert index is not None
    assert sum(map(len, index.values())) > len(list(PDF_ROOT_DIR.iterdir()))

    with open("index.json.orig", "w") as outfile:
        json.dump(index, outfile, indent=4)


if __name__ == "__main__":
    test_dir_crawler()
