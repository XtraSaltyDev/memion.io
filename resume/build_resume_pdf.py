from __future__ import annotations

import re
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "resume" / "Miller-Emion-Resume-UPDATED.md"
OUT = ROOT / "public" / "resume.pdf"


def clean_inline(text: str) -> str:
    text = escape(text.strip())
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r"<font name='Courier'>\1</font>", text)
    return text


def add_section_rule(story: list, color: colors.Color) -> None:
    story.append(Spacer(1, 3))
    story.append(
        Paragraph(f"<font color='{color.hexval()}'>____________________________</font>", STYLES["Rule"])
    )


BASE_STYLES = getSampleStyleSheet()
STYLES = {
    "Title": ParagraphStyle(
        "ResumeTitle",
        parent=BASE_STYLES["Title"],
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
        fontSize=19,
        leading=22,
        textColor=colors.HexColor("#111827"),
        spaceAfter=2,
    ),
    "Subtitle": ParagraphStyle(
        "ResumeSubtitle",
        parent=BASE_STYLES["Normal"],
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#075C45"),
        spaceAfter=2,
    ),
    "Contact": ParagraphStyle(
        "ResumeContact",
        parent=BASE_STYLES["Normal"],
        alignment=TA_CENTER,
        fontSize=8.7,
        leading=11,
        textColor=colors.HexColor("#526173"),
        spaceAfter=7,
    ),
    "Heading": ParagraphStyle(
        "ResumeHeading",
        parent=BASE_STYLES["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#075C45"),
        spaceBefore=6,
        spaceAfter=1,
    ),
    "Subheading": ParagraphStyle(
        "ResumeSubheading",
        parent=BASE_STYLES["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=10.2,
        leading=12,
        textColor=colors.HexColor("#111827"),
        spaceBefore=4,
        spaceAfter=1,
    ),
    "Body": ParagraphStyle(
        "ResumeBody",
        parent=BASE_STYLES["BodyText"],
        fontSize=9.1,
        leading=11.3,
        textColor=colors.HexColor("#263241"),
        spaceAfter=3,
    ),
    "Bullet": ParagraphStyle(
        "ResumeBullet",
        parent=BASE_STYLES["BodyText"],
        fontSize=8.9,
        leading=10.8,
        leftIndent=13,
        firstLineIndent=0,
        bulletIndent=2,
        bulletFontName="Helvetica",
        bulletFontSize=7,
        textColor=colors.HexColor("#263241"),
        spaceAfter=2,
    ),
    "Rule": ParagraphStyle(
        "ResumeRule",
        parent=BASE_STYLES["Normal"],
        fontSize=4,
        leading=4,
        spaceAfter=1,
    ),
}


def append_bullets(story: list, bullets: list[str]) -> None:
    if not bullets:
        return

    for bullet in bullets:
        story.append(Paragraph(clean_inline(bullet), STYLES["Bullet"], bulletText="\u2022"))
    bullets.clear()


def build_story(markdown: str) -> list:
    story: list = []
    bullets: list[str] = []
    paragraphs: list[str] = []
    title_seen = False
    subtitle_seen = False
    contact_seen = False

    def flush_paragraphs() -> None:
        nonlocal paragraphs
        if paragraphs:
            story.append(Paragraph(clean_inline(" ".join(paragraphs)), STYLES["Body"]))
            paragraphs = []

    for raw_line in markdown.splitlines():
        line = raw_line.strip()
        if not line:
            append_bullets(story, bullets)
            flush_paragraphs()
            continue

        if line.startswith("# "):
            append_bullets(story, bullets)
            flush_paragraphs()
            story.append(Paragraph(clean_inline(line[2:]), STYLES["Title"]))
            title_seen = True
            continue

        if title_seen and not subtitle_seen:
            story.append(Paragraph(clean_inline(line), STYLES["Subtitle"]))
            subtitle_seen = True
            continue

        if subtitle_seen and not contact_seen:
            story.append(Paragraph(clean_inline(line), STYLES["Contact"]))
            contact_seen = True
            continue

        if line.startswith("## "):
            append_bullets(story, bullets)
            flush_paragraphs()
            story.append(Paragraph(clean_inline(line[3:].upper()), STYLES["Heading"]))
            add_section_rule(story, colors.HexColor("#D9E2DD"))
            continue

        if line.startswith("### "):
            append_bullets(story, bullets)
            flush_paragraphs()
            story.append(Paragraph(clean_inline(line[4:]), STYLES["Subheading"]))
            continue

        if line.startswith("- "):
            flush_paragraphs()
            bullets.append(line[2:])
            continue

        append_bullets(story, bullets)
        paragraphs.append(line)

    append_bullets(story, bullets)
    flush_paragraphs()
    return story


def build() -> Path:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=LETTER,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        title="Miller Emion Resume",
        author="Miller Emion",
    )
    doc.build(build_story(SOURCE.read_text(encoding="utf8")))
    return OUT


if __name__ == "__main__":
    print(build())
