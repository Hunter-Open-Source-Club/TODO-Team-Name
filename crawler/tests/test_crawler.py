# -*- coding: utf-8 -*-

from crawler.crawl_pdf import PdfCrawler, DirCrawler
from pathlib import Path

__author__ = "Blake Vente"
__copyright__ = "Blake Vente"
__license__ = "mit"

PDF_ROOT_DIR = Path("./_test_fixtures")
CS_127 = PDF_ROOT_DIR / "CS_127"


def test_pdf_crawler():
    pdf_file = CS_127 / "CS127_ligorio_syllabus_s20.pdf"
    crawler = PdfCrawler()
    assert "python" in crawler.pdf_to_text(pdf_file).lower()


def test_dir_crawler():
    crawler = DirCrawler()
    c_dir = crawler.dir_to_pdf_contents(CS_127)
    assert "CS_127" in c_dir
    pdf_contents = c_dir["CS_127"]
    assert len(pdf_contents) > 0
    assert "Python" in pdf_contents[0]
    index = crawler.dir_to_index(PDF_ROOT_DIR)
    print(index)
    assert len(index) > len(list(PDF_ROOT_DIR.iterdir()))
    assert index is not None
    index.to_json("index.json")


if __name__ == "__main__":
    test_dir_crawler()
