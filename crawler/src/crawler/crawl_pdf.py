# -*- coding: utf-8 -*-
"""
Open PDF file contents into directories
"""

import logging

from pathlib import Path
from typing import BinaryIO, DefaultDict, Dict, Generator, List, Text
import pdfplumber
import pandas as pd


__author__ = "Blake Vente"
__copyright__ = "Blake Vente"
__license__ = "mit"

_logger = logging.getLogger(__name__)


class PdfCrawler:
    def pdf_to_pages(self, pdf_path: Path) -> List[str]:
        """
        Returns:
            -  text extracted from pdfs
            -  returns the empty list if file doesn't exist
        """
        extracted_pages = []
        try:
            self.validate_pdf(pdf_path)
            with pdfplumber.open(pdf_path) as pdf:
                extracted_pages.extend(
                    map(lambda pg: (pg.extract_text() or ""), pdf.pages)
                )
        except ValueError as e:
            _logger.info(e)
            _logger.error(f"pdf {pdf_path} not a file, returning {extracted_pages}")

        return extracted_pages

    def pdf_to_text(self, pdf_path: Path) -> str:
        return "\n".join(self.pdf_to_pages(pdf_path)) or ""

    def validate_pdf(self, pdf_path: Path) -> bool:
        pdf_name = pdf_path.name

        if not pdf_path.is_file:
            raise ValueError(f"Expected file, given {pdf_name} which is not a file")

        if not pdf_path.name.endswith(".pdf"):
            raise ValueError(f"Expected filename ending with pdf, given {pdf_name}")

        return True


class DirCrawler(PdfCrawler):
    def dir_to_index(self, dir_to_pdf_dir: Path) -> DefaultDict[str, List]:
        """
        Args:
            dir_dir_pdf: like DIR in DIR/SUBDIR/EXAMPLE.pdf

        Returns:
            pd.DataFrame of ['fname', 'syllabus_text']
        """
        index = DefaultDict(list)
        for course_id in dir_to_pdf_dir.iterdir():
            try:
                syllabi = self.dir_to_pdf_contents(course_id)
                index[course_id.name].extend(syllabi)

            except (ValueError, TypeError) as e:
                _logger.info(e)
                _logger.error(f"Processing failed for {dir_to_pdf_dir}")
        return index

    def dir_to_pdf_contents(self, valid_pdf_dir: Path) -> List[str]:
        """
        Args:
            valid_pdf_dir: a checked directory

        Returns:
            {'dir_name' : List[PDFContents]}
        """
        return [self.pdf_to_text(pdf) for pdf in valid_pdf_dir.iterdir()]

    def validate_dir(self, pdf_dir: Path) -> bool:

        pdf_name = pdf_dir.name

        if not pdf_dir.is_dir:
            raise ValueError(f"Expected dir, given {pdf_name} which is not a dir")

        if not pdf_dir.name.endswith(".pdf"):
            raise ValueError(f"Expected filename ending with pdf, given {pdf_name}")

        return True
