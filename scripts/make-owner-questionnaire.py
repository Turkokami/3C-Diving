#!/usr/bin/env python3
"""
make-owner-questionnaire.py - generates the owner information request PDF.

Every question maps to a field that is currently `null` in src/data/business.ts or
to a blocker in docs/BUILD-QUEUE.md. Nothing is asked that the build does not
actually consume, and each question states what it unlocks, so the owner can see
why it is worth answering rather than being handed a generic intake form.

Palette and type echo the real brand taken from the owner's own site: charcoal
(#0d0e10 / #1a1c21), pewter, and a serif display face standing in for Georgia.

Regenerate:  python scripts/make-owner-questionnaire.py
"""
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, PageBreak, Flowable,
)

# Brand, lifted from the owner's existing site CSS
CHAR_D = colors.HexColor('#0d0e10')
CHAR   = colors.HexColor('#1a1c21')
CHAR_L = colors.HexColor('#23262c')
PEWTER = colors.HexColor('#70737c')
STEEL  = colors.HexColor('#4a6b80')
CRIT   = colors.HexColor('#8f3520')
INK    = colors.HexColor('#14161a')
BODY   = colors.HexColor('#3a4048')
MUTED  = colors.HexColor('#6f767f')
LINE   = colors.HexColor('#c8ced4')
SURF   = colors.HexColor('#f3f5f7')
PALE   = colors.HexColor('#a9b3bd')

PAGE_W, PAGE_H = LETTER
MARGIN = 0.7 * inch
CONTENT_W = PAGE_W - 2 * MARGIN

S = {
    'h1':   ParagraphStyle('h1', fontName='Times-Bold', fontSize=24, leading=27,
                           textColor=colors.white, spaceAfter=5),
    'sub':  ParagraphStyle('sub', fontName='Helvetica', fontSize=10, leading=14,
                           textColor=PALE),
    'sec':  ParagraphStyle('sec', fontName='Times-Bold', fontSize=15, leading=18,
                           textColor=colors.white),
    'secn': ParagraphStyle('secn', fontName='Helvetica', fontSize=8.8, leading=12,
                           textColor=PALE),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.8, leading=14,
                           textColor=BODY, spaceAfter=6, alignment=TA_LEFT),
    'q':    ParagraphStyle('q', fontName='Helvetica-Bold', fontSize=10.2, leading=13.5,
                           textColor=INK, spaceAfter=2),
    'why':  ParagraphStyle('why', fontName='Helvetica-Oblique', fontSize=8.6, leading=11.5,
                           textColor=MUTED, spaceAfter=4),
    'note': ParagraphStyle('note', fontName='Helvetica', fontSize=9.2, leading=13,
                           textColor=INK),
}


class Rule(Flowable):
    """A ruled answer line."""
    def __init__(self, width, gap=15):
        Flowable.__init__(self)
        self.width, self.height = width, gap

    def draw(self):
        self.canv.setStrokeColor(LINE)
        self.canv.setLineWidth(0.6)
        self.canv.line(0, 2, self.width, 2)


def band(text, note=None, color=CHAR):
    rows = [[Paragraph(text, S['sec'])]]
    if note:
        rows.append([Paragraph(note, S['secn'])])
    t = Table(rows, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (0, 0), 9),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 9),
        ('TOPPADDING', (0, 1), (-1, -1), 1),
        ('LINEBELOW', (0, -1), (-1, -1), 2, PEWTER),
    ]))
    return t


def tag(label, color):
    t = Table([[Paragraph(label, ParagraphStyle(
        'tg', fontName='Helvetica-Bold', fontSize=7.2, leading=9,
        textColor=colors.white))]], colWidths=[64])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    return t


def question(num, text, why=None, lines=2, prio=None):
    parts = []
    if prio:
        label, color = prio
        row = Table([[tag(label, color), '']], colWidths=[64, CONTENT_W - 64])
        row.setStyle(TableStyle([
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        parts.append(row)

    parts.append(Paragraph(
        '<font color="#4a6b80"><b>%d.</b></font>&nbsp; %s' % (num, text), S['q']))
    parts.append(Paragraph(why, S['why']) if why else Spacer(1, 2))

    for _ in range(lines):
        parts.append(Rule(CONTENT_W - 6))
        parts.append(Spacer(1, 7))
    parts.append(Spacer(1, 6))
    return KeepTogether(parts)


def callout(text, edge=PEWTER, bg=SURF):
    t = Table([[Paragraph(text, S['note'])]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('LINEBEFORE', (0, 0), (0, -1), 3, edge),
        ('LEFTPADDING', (0, 0), (-1, -1), 11),
        ('RIGHTPADDING', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ]))
    return t


def on_page(canv, doc):
    canv.saveState()
    canv.setStrokeColor(LINE)
    canv.setLineWidth(0.6)
    canv.line(MARGIN, 0.62 * inch, PAGE_W - MARGIN, 0.62 * inch)
    canv.setFont('Helvetica', 7.6)
    canv.setFillColor(MUTED)
    canv.drawString(MARGIN, 0.45 * inch,
                    '3rd Coast Commercial Diving & Salvage   |   3cdiving.com website build')
    canv.drawRightString(PAGE_W - MARGIN, 0.45 * inch, 'Page %d' % canv.getPageNumber())
    canv.restoreState()


CRITICAL = ('CRITICAL', CRIT)
IMPORTANT = ('IMPORTANT', colors.HexColor('#9a6b1f'))
USEFUL = ('USEFUL', STEEL)

STORY = []
A = STORY.append

# ── Title ────────────────────────────────────────────────────────────────────
title = Table([
    [Paragraph('Information we need from you', S['h1'])],
    [Paragraph('3rd Coast Commercial Diving &amp; Salvage'
               '&nbsp;&nbsp;&#183;&nbsp;&nbsp; 3cdiving.com website build'
               '&nbsp;&nbsp;&#183;&nbsp;&nbsp; August 2026', S['sub'])],
], colWidths=[CONTENT_W])
title.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), CHAR_D),
    ('LEFTPADDING', (0, 0), (-1, -1), 18),
    ('RIGHTPADDING', (0, 0), (-1, -1), 18),
    ('TOPPADDING', (0, 0), (0, 0), 20),
    ('BOTTOMPADDING', (0, -1), (-1, -1), 20),
    ('TOPPADDING', (0, 1), (-1, -1), 2),
    ('LINEBELOW', (0, -1), (-1, -1), 3, PEWTER),
]))
A(title)
A(Spacer(1, 14))

A(Paragraph(
    'The new website is built and live. Below is everything we still need from you to finish it properly. '
    'Please answer what you can, and write <b>"none"</b> or <b>"not yet"</b> where that is the honest answer. '
    'That is genuinely useful information and a perfectly good answer to any question here.', S['body']))

A(callout(
    '<b>Why we will not simply write something plausible.</b> Everything on the site has to be true and '
    'defensible. Your buyers are port engineers, vessel operators and class surveyors, and they check. '
    'So we do not publish a credential, a certification, a founding year, a review or a photograph unless you '
    'have confirmed it. Anything left blank stays off the site until you fill it in. It will not be invented '
    'and it will not be guessed.', STEEL, colors.HexColor('#eef2f5')))
A(Spacer(1, 13))

A(Paragraph('<b>How the questions are marked</b>', S['note']))
A(Spacer(1, 7))
leg = Table([
    [tag('CRITICAL', CRIT),
     Paragraph('Biggest impact on how the site performs. Please prioritise these.', S['body'])],
    [tag('IMPORTANT', IMPORTANT[1]),
     Paragraph('Meaningful improvement, and needed before the relevant pages can be finished.', S['body'])],
    [tag('USEFUL', STEEL),
     Paragraph('Improves the site, but nothing is blocked without it.', S['body'])],
], colWidths=[72, CONTENT_W - 72])
leg.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (0, -1), 0),
    ('LEFTPADDING', (1, 0), (1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
A(leg)
A(Spacer(1, 11))

A(callout(
    '<b>One thing worth knowing before you start.</b> The single biggest weakness of the site as it stands is '
    'that it names no people and lists no credentials. Your closest real competitor leads with seven '
    'class-society approvals and names its owners. In commercial diving the credentials effectively '
    '<i>are</i> the sales pitch. <b>Section C matters more than everything else on this form combined.</b>',
    CRIT, colors.HexColor('#f8ecea')))

A(PageBreak())

# ── A ────────────────────────────────────────────────────────────────────────
A(band('A. Business identity and location',
       'Needed for the business listing, Google Maps eligibility, and the search-engine record of who you are.'))
A(Spacer(1, 13))

A(question(1, 'What is the exact registered legal name of the business?',
           'As it appears on the state registration, including "LLC", "Inc." or similar. This may differ from the trading name.',
           lines=1, prio=CRITICAL))

A(question(2, 'What is the physical street address the business operates from?',
           'A real street address is what makes a Google Business Profile possible, and that profile is what puts you in map '
           'results and gives you star ratings. Your site currently shows no address anywhere, which is the largest single '
           'local-search gap you have.',
           lines=3, prio=CRITICAL))

A(question(3, 'Can that address be published publicly, or is it a yard or home address you would rather not list?',
           'If it cannot be published, say so. There are legitimate ways to handle a service-area business, but we need to know which situation applies.',
           lines=2, prio=IMPORTANT))

A(question(4, 'What are your normal business hours?',
           'For example: Monday to Friday, 7:00am to 5:00pm. If it changes by season, tell us how.',
           lines=2, prio=IMPORTANT))

A(question(5, 'Do you genuinely run a 24-hour emergency callout, and how is it answered outside hours?',
           'Your current site offers 24/7 emergency response. We need to confirm that is real before we keep saying it.',
           lines=2, prio=IMPORTANT))

A(question(6, 'What year did the business start operating?',
           'Lets us say "serving the Gulf Coast since ____", which is a meaningful trust signal. Leave blank if you would rather not state it.',
           lines=1, prio=USEFUL))

A(PageBreak())

# ── B ────────────────────────────────────────────────────────────────────────
A(band('B. Phone numbers and contact details',
       'Your phone number must match exactly everywhere it appears. Getting this right once fixes it across every page.'))
A(Spacer(1, 13))

A(callout(
    '<b>The issue.</b> Your main number, (713) 384-1954, is a <b>Houston</b> area code, roughly 300 miles away. '
    'The entire argument of your business is that you are local to Brownsville: faster response, lower mobilisation '
    'cost, a crew that knows the ports. Leading with a Houston number quietly undercuts that, both for customers '
    'reading the page and for search engines deciding which businesses are local to Brownsville. Your (956) number '
    'is local, but is currently shown only as the Spanish line.'))
A(Spacer(1, 13))

A(question(7, 'Which number should be the main number on the website?',
           'We recommend a 956 local number as the main one, keeping the 713 displayed as well. But it is your call, and if '
           'the 713 number is where the work actually comes from, say so and we will keep it.',
           lines=2, prio=CRITICAL))

A(question(8, 'Is (956) 455-8476 answered by the same team as the main line, or by a separate person?',
           'Determines whether we present it as "our Spanish line" or as a genuinely separate contact.',
           lines=2, prio=IMPORTANT))

A(question(9, 'Do you want a business email address on your own domain, such as info@3cdiving.com?',
           'You currently use a gmail.com address. That costs credibility with port authorities and institutional buyers who '
           'expect a contractor on their own domain. Your gmail address can keep working as a forward, so no enquiry is lost.',
           lines=2, prio=IMPORTANT))

A(question(10, 'When someone fills in the "Request a Quote" form today, where does it actually go?',
           'This one is urgent. If there is an existing form, inbox or CRM receiving your leads, we must connect the new site '
           'to it. Otherwise enquiries could silently stop arriving and nobody would notice for weeks.',
           lines=3, prio=CRITICAL))

A(PageBreak())

# ── C ────────────────────────────────────────────────────────────────────────
A(band('C. People and credentials',
       'The most important section on this form. None of it can be written without you.'))
A(Spacer(1, 13))

A(callout(
    '<b>Why this section decides how well the site performs.</b> A port engineer or class surveyor choosing a dive '
    'contractor is assessing risk, and they do it by looking at credentials and named, accountable people. A site '
    'with neither reads as unproven no matter how good the writing is. Every field below is currently blank on your '
    'site and on every page we build. Filling them in is the largest single improvement available, and it costs '
    'nothing but the information.', CRIT, colors.HexColor('#f8ecea')))
A(Spacer(1, 13))

A(question(11, 'Who is the owner and/or lead dive supervisor? Full name and job title.',
           'The site needs at least one named, accountable person. "Our team" is not a person, and buyers in this industry notice.',
           lines=2, prio=CRITICAL))

A(question(12, 'How long has that person worked in commercial diving, and what is their background?',
           'A few sentences is plenty. Where they trained, what work they have done, anything notable. We will write it up properly.',
           lines=4, prio=CRITICAL))

A(question(13, 'Are you a member of ADCI (Association of Diving Contractors International)? Membership number?',
           'ADCI membership is the recognised baseline credential for US commercial diving contractors.',
           lines=2, prio=CRITICAL))

A(question(14, 'Does anyone hold AWS D3.6M underwater welding certification? Who, and what class?',
           'The recognised standard for underwater welding. If yes, this belongs on every welding-related page.',
           lines=2, prio=CRITICAL))

A(question(15, 'Do you hold any class-society approval, or have you applied for one?',
           'ABS, Lloyd&#8217;s Register, DNV, Bureau Veritas, ClassNK, Korean Register, RINA. This is the highest-value credential '
           'in your industry and your nearest competitor advertises seven. Without one, certain class survey work cannot be '
           'credited to you at all. If you hold even one it must be prominent. If you hold none, say so, and it is worth '
           'discussing whether to pursue one.',
           lines=3, prio=CRITICAL))

A(question(16, 'Do your divers hold TWIC cards and/or USCG credentials?',
           'TWIC is required for unescorted access to secure port areas. Saying so plainly removes a real doubt for terminal customers.',
           lines=2, prio=IMPORTANT))

A(question(17, 'What insurance do you carry, and at what limits?',
           'Marine general liability, Jones Act / USL&amp;H cover for divers, vessel cover. Institutional buyers ask for this before '
           'they will even take a quote. We will not publish limits without your say-so.',
           lines=3, prio=IMPORTANT))

A(question(18, 'How many divers and support staff do you have available?',
           'US regulations require a minimum three-person team for surface-supplied diving. Knowing your capacity lets us describe it accurately.',
           lines=2, prio=IMPORTANT))

A(PageBreak())

# ── D ────────────────────────────────────────────────────────────────────────
A(band('D. Equipment and capability',
       'Buyers in this industry ask these questions before they ask about price.'))
A(Spacer(1, 13))

A(callout(
    '<b>From your photographs</b> we can see surface-supplied diving with a dedicated tender managing the umbilical, '
    'working off a barge alongside a long-reach excavator and a crawler crane. That already tells us a good deal. '
    'The questions below fill in the rest.'))
A(Spacer(1, 13))

A(question(19, 'What diving methods do you use: surface-supplied air, scuba, or both?',
           'Surface-supplied is the professional standard for most commercial work and is worth stating clearly if it is what you use.',
           lines=2, prio=IMPORTANT))

A(question(20, 'What is the maximum depth you are equipped and qualified to work to?',
           lines=1, prio=IMPORTANT))

A(question(21, 'Do you own a boat or barge? Name, type and size if so.',
           'Owning your own vessel means you are not waiting on a charter, which is a real scheduling advantage worth stating.',
           lines=2, prio=IMPORTANT))

A(question(22, 'What major equipment do you own?',
           'For example: dive spread and compressors, hydraulic tools, hull cleaning brush cart, underwater cutting and welding gear, '
           'video and inspection cameras, lift bags, decompression chamber, ROV.',
           lines=4, prio=IMPORTANT))

A(question(23, 'Is there any work listed on your site that you would rather NOT receive enquiries for?',
           'Better to remove it than to keep turning the work down. Equally, tell us anything you do that is not currently listed.',
           lines=3, prio=USEFUL))

A(Spacer(1, 8))

# ── E ────────────────────────────────────────────────────────────────────────
A(band('E. Where you will actually travel',
       'We build pages for the places you serve. Building them for places you will not go just generates wasted calls.'))
A(Spacer(1, 13))

A(question(24, 'How far will you realistically mobilise for a job?',
           'Please answer for both a routine scheduled job and an emergency callout, if those differ.',
           lines=2, prio=CRITICAL))

A(question(25, 'Which of these would you take work in? Please circle or mark them.',
           'Your site currently claims only Brownsville, Port Isabel, South Padre Island and the South Texas Gulf Coast. Your '
           'Houston phone number suggests you may reach further, which is why we are asking rather than assuming.',
           lines=0, prio=CRITICAL))

terr = Table([
    [Paragraph('<b>Deep South Texas</b>', S['note']),
     Paragraph('Port of Brownsville &nbsp;&#183;&nbsp; Brownsville &nbsp;&#183;&nbsp; Port Isabel &nbsp;&#183;&nbsp; '
               'South Padre Island &nbsp;&#183;&nbsp; Brazos Santiago Pass &nbsp;&#183;&nbsp; Harlingen '
               '&nbsp;&#183;&nbsp; Los Fresnos &nbsp;&#183;&nbsp; Laguna Vista', S['body'])],
    [Paragraph('<b>Coastal Bend</b>', S['note']),
     Paragraph('Corpus Christi &nbsp;&#183;&nbsp; Port Aransas &nbsp;&#183;&nbsp; Ingleside &nbsp;&#183;&nbsp; '
               'Aransas Pass &nbsp;&#183;&nbsp; Rockport &nbsp;&#183;&nbsp; Harbor Island', S['body'])],
    [Paragraph('<b>Upper coast</b>', S['note']),
     Paragraph('Freeport &nbsp;&#183;&nbsp; Texas City &nbsp;&#183;&nbsp; Galveston &nbsp;&#183;&nbsp; Houston Ship Channel', S['body'])],
    [Paragraph('<b>Mexico</b>', S['note']),
     Paragraph('Do you take work across the border, such as Matamoros, Tampico or Altamira? '
               '&nbsp;&nbsp;&nbsp; YES &nbsp;&nbsp;/&nbsp;&nbsp; NO', S['body'])],
], colWidths=[110, CONTENT_W - 110])
terr.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BACKGROUND', (0, 0), (-1, -1), SURF),
    ('BOX', (0, 0), (-1, -1), 0.7, LINE),
    ('INNERGRID', (0, 0), (-1, -1), 0.6, LINE),
    ('LEFTPADDING', (0, 0), (-1, -1), 9),
    ('RIGHTPADDING', (0, 0), (-1, -1), 9),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
A(terr)

A(PageBreak())

# ── F ────────────────────────────────────────────────────────────────────────
A(band('F. Proof of work: photographs, jobs and reviews',
       'The biggest remaining content gap. None of this can be created without you.'))
A(Spacer(1, 13))

A(callout(
    '<b>Thank you for the three photographs.</b> They are genuinely good and we are using them. They show '
    'surface-supplied diving with a tender, barge and crane work, and the Queen Isabella Causeway in the background, '
    'which places the work firmly on your own coast. That is exactly the kind of proof no competitor can copy. '
    '<b>More would help a great deal</b> and they are the strongest asset available to this site.'))
A(Spacer(1, 13))

A(question(26, 'Can you send more photographs? Different jobs, the boat, the dive spread, the crew, equipment on the dock.',
           'Phone photos are completely fine. Topside shots are just as useful as underwater ones. Ideally we want a few per '
           'service, so a hull cleaning page shows hull cleaning rather than a generic dive photo.',
           lines=3, prio=CRITICAL))

A(question(27, 'For each photo, roughly where and what was it? A one-line note per photo is enough.',
           'Needed so captions and descriptions are accurate. We describe what is actually in the picture rather than guessing, '
           'which matters both for honesty and for how images are found in search.',
           lines=3, prio=IMPORTANT))

A(question(28, 'Can you describe 3 to 6 real jobs you have completed?',
           'For each: what the problem was, what you did, and how it turned out. These become case studies, which are the most '
           'persuasive pages on any contractor website. Rough notes are fine, a few sentences each is enough to start.',
           lines=6, prio=CRITICAL))

A(question(29, 'For those jobs, may we name the client and the vessel, or should they stay anonymous?',
           'We will not name any customer without your explicit confirmation that they have agreed. Anonymous works perfectly '
           'well: "a bulk carrier at the Port of Brownsville" is still a real, credible case study.',
           lines=2, prio=IMPORTANT))

A(question(30, 'Do you have a Google Business Profile? Any reviews anywhere?',
           'Google Business Profile is what puts you in map results and is where star ratings come from. If you do not have one, '
           'it should be the very next thing set up. It is free and it is the highest-return item on this entire form.',
           lines=2, prio=CRITICAL))

A(question(31, 'Do you have Facebook, LinkedIn or any other business profiles? Please include the links.',
           'These help search engines confirm you are a real, established business rather than a new unknown.',
           lines=2, prio=IMPORTANT))

A(question(32, 'Are there past customers who would leave you a review if asked?',
           'We can set up a simple process for requesting them. Reviews are earned in the field rather than built into a website, '
           'but they move the needle more than almost anything else.',
           lines=2, prio=IMPORTANT))

A(PageBreak())

# ── G ────────────────────────────────────────────────────────────────────────
A(band('G. How the business actually works',
       'Background so the writing sounds like you, rather than like a generic contractor.'))
A(Spacer(1, 13))

A(question(33, 'What kind of work do you most want more of?',
           'We can weight the site toward it. Be specific if you can. "Scheduled hull cleaning contracts" is far more useful than "more work".',
           lines=3, prio=IMPORTANT))

A(question(34, 'Who are your main customers today?',
           'For example vessel operators, the shrimp fleet, terminals, marine contractors, government agencies, private boat owners. '
           'A rough percentage split helps if you have a sense of it.',
           lines=3, prio=IMPORTANT))

A(question(35, 'Why do customers choose you over the bigger Houston-based outfits?',
           'Your own words are genuinely valuable here. Whatever you would say on the phone to a customer asking this is what belongs on the site.',
           lines=4, prio=IMPORTANT))

A(question(36, 'Is your work seasonal? What does a typical year look like?',
           'Hurricane season, shrimp season, drydock and survey cycles. Lets us publish the right content at the right time of year.',
           lines=3, prio=USEFUL))

A(question(37, 'Is there anything competitors claim that you think is misleading?',
           'Useful for knowing what to address head-on. We will not name them.',
           lines=3, prio=USEFUL))

A(question(38, 'Anything else we should know, or anything on the current site that is wrong?',
           lines=4, prio=USEFUL))

A(Spacer(1, 14))

# ── Return ───────────────────────────────────────────────────────────────────
A(band('Returning this form', None, CHAR_L))
A(Spacer(1, 13))
A(Paragraph(
    'There is no need to complete this in one sitting, and no need to answer everything. '
    '<b>If you only have time for one part, make it Section C (people and credentials) and question 26 '
    '(more photographs).</b> Those two carry more weight than the rest of the form combined.', S['body']))
A(Spacer(1, 3))
A(Paragraph(
    'Handwritten answers photographed on your phone are absolutely fine. So is a voice note or a phone call. '
    'If it is easier to talk it through, we will take notes and write it up for your approval.', S['body']))
A(Spacer(1, 14))

sign = Table([[Paragraph('Completed by', S['note']), '', Paragraph('Date', S['note']), '']],
             colWidths=[78, CONTENT_W - 78 - 42 - 120, 42, 120])
sign.setStyle(TableStyle([
    ('LINEBELOW', (1, 0), (1, 0), 0.8, LINE),
    ('LINEBELOW', (3, 0), (3, 0), 0.8, LINE),
    ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING', (0, 0), (-1, -1), 12),
]))
A(sign)


def build(path):
    doc = BaseDocTemplate(
        path, pagesize=LETTER,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=0.85 * inch,
        title='3rd Coast Commercial Diving - Owner Information Request',
        author='Website build team',
        subject='Information needed to complete the 3cdiving.com website build')
    frame = Frame(MARGIN, 0.85 * inch, CONTENT_W, PAGE_H - MARGIN - 0.85 * inch,
                  id='main', leftPadding=0, rightPadding=0,
                  topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id='all', frames=[frame], onPage=on_page)])
    doc.build(STORY)


if __name__ == '__main__':
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else 'docs/3rd-Coast-Owner-Questionnaire.pdf'
    build(out)
    print('Wrote ' + out)
