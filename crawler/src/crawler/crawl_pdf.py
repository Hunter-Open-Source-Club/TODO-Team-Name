# -*- coding: utf-8 -*-
"""
Open PDF file contents into directories
"""

import logging

from pathlib import Path
from typing import List
import pdfplumber


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
        extracted_text = []
        try:
            self.validate_pdf(pdf_path)
            with pdfplumber.open(pdf_path) as pdf:
                extracted_text.extend(map(lambda pg: pg.extract_text(), pdf.pages))
        except ValueError as e:
            _logger.log(e)
            _logger.error(f"pdf {pdf_path} not a file, returning {extracted_text}")

        return extracted_text

    def validate_pdf(self, pdf_path: Path) -> bool:
        pdf_name = pdf_path.name

        if not pdf_path.is_file:
            raise ValueError(f"Expected file, given {pdf_name} which is not a file")

        if not pdf_path.name.endswith(".pdf"):
            raise ValueError(f"Expected filename ending with pdf, given {pdf_name}")

        return True
